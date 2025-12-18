package com.learnix.repository;

import com.learnix.model.Payment;
import com.learnix.model.PaymentStatus;
import com.learnix.model.Course;
import com.learnix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    Optional<Payment> findByStripeSessionId(String stripeSessionId);
    
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
    
    List<Payment> findByUser(User user);
    
    List<Payment> findByCourse(Course course);
    
    List<Payment> findByUserAndStatus(User user, PaymentStatus status);
    
    boolean existsByUserAndCourseAndStatus(User user, Course course, PaymentStatus status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.course.instructor = :instructor AND p.status = 'COMPLETED'")
    BigDecimal getInstructorRevenue(User instructor);
}
