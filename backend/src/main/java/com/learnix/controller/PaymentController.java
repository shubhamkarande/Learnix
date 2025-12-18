package com.learnix.controller;

import com.learnix.dto.CheckoutRequest;
import com.learnix.dto.CheckoutResponse;
import com.learnix.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments/create-checkout")
    public ResponseEntity<CheckoutResponse> createCheckoutSession(
            @Valid @RequestBody CheckoutRequest request) throws StripeException {
        return ResponseEntity.ok(paymentService.createCheckoutSession(request));
    }

    @GetMapping("/payments/check/{courseId}")
    public ResponseEntity<Boolean> hasUserPurchasedCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(paymentService.hasUserPurchasedCourse(courseId));
    }
}
