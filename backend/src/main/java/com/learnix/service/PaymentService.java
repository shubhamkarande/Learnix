package com.learnix.service;

import com.learnix.dto.CheckoutRequest;
import com.learnix.dto.CheckoutResponse;
import com.learnix.model.*;
import com.learnix.repository.*;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    @Value("${cors.allowed-origins}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @Transactional
    public CheckoutResponse createCheckoutSession(CheckoutRequest request) throws StripeException {
        User user = getCurrentUser();
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if already enrolled
        if (enrollmentRepository.existsByStudentAndCourse(user, course)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        // Check if already has a completed payment
        if (paymentRepository.existsByUserAndCourseAndStatus(user, course, PaymentStatus.COMPLETED)) {
            throw new RuntimeException("Payment already completed for this course");
        }

        String successUrl = request.getSuccessUrl() != null 
                ? request.getSuccessUrl() 
                : frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}";
        String cancelUrl = request.getCancelUrl() != null 
                ? request.getCancelUrl() 
                : frontendUrl + "/payment/cancel";

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setCustomerEmail(user.getEmail())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(course.getPrice().multiply(BigDecimal.valueOf(100)).longValue())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(course.getTitle())
                                                                .setDescription(course.getShortDescription())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("userId", user.getId().toString())
                .putMetadata("courseId", course.getId().toString())
                .build();

        Session session = Session.create(params);

        // Create payment record
        Payment payment = Payment.builder()
                .user(user)
                .course(course)
                .stripeSessionId(session.getId())
                .amount(course.getPrice())
                .currency("USD")
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        return CheckoutResponse.builder()
                .sessionId(session.getId())
                .checkoutUrl(session.getUrl())
                .build();
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe webhook signature", e);
            throw new RuntimeException("Invalid webhook signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutSessionCompleted(event);
                break;
            case "payment_intent.payment_failed":
                handlePaymentFailed(event);
                break;
            default:
                log.info("Unhandled event type: {}", event.getType());
        }
    }

    private void handleCheckoutSessionCompleted(Event event) {
        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new RuntimeException("Failed to deserialize session"));

        Payment payment = paymentRepository.findByStripeSessionId(session.getId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.info("Payment already processed: {}", payment.getId());
            return;
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setStripePaymentIntentId(session.getPaymentIntent());
        payment.setCompletedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Create enrollment
        if (!enrollmentRepository.existsByStudentAndCourse(payment.getUser(), payment.getCourse())) {
            Enrollment enrollment = Enrollment.builder()
                    .student(payment.getUser())
                    .course(payment.getCourse())
                    .progressPercentage(0)
                    .completedLessons(0)
                    .completed(false)
                    .build();
            enrollmentRepository.save(enrollment);

            // Update course enrollment count
            Course course = payment.getCourse();
            course.setTotalEnrollments(course.getTotalEnrollments() + 1);
            courseRepository.save(course);
        }

        log.info("Payment completed and enrollment created for user: {}, course: {}",
                payment.getUser().getEmail(), payment.getCourse().getTitle());
    }

    private void handlePaymentFailed(Event event) {
        // Handle payment failure - update payment status
        log.error("Payment failed: {}", event.getId());
    }

    @Transactional(readOnly = true)
    public boolean hasUserPurchasedCourse(UUID courseId) {
        User user = getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return paymentRepository.existsByUserAndCourseAndStatus(user, course, PaymentStatus.COMPLETED);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
