package com.learnix.service;

import com.learnix.dto.ReviewRequest;
import com.learnix.model.Course;
import com.learnix.model.Review;
import com.learnix.model.User;
import com.learnix.repository.CourseRepository;
import com.learnix.repository.EnrollmentRepository;
import com.learnix.repository.ReviewRepository;
import com.learnix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public Page<Review> getCourseReviews(UUID courseId, int page, int size) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return reviewRepository.findByCourseOrderByCreatedAtDesc(course, PageRequest.of(page, size));
    }

    public Double getCourseAverageRating(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return reviewRepository.getAverageRatingByCourse(course);
    }

    public long getCourseReviewCount(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return reviewRepository.countByCourse(course);
    }

    @Transactional
    public Review createOrUpdateReview(UUID courseId, ReviewRequest request) {
        User user = getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if user is enrolled in the course
        if (!enrollmentRepository.existsByStudentAndCourse(user, course)) {
            throw new RuntimeException("You must be enrolled in this course to leave a review");
        }

        // Check if review already exists
        Review review = reviewRepository.findByUserAndCourse(user, course)
                .orElse(Review.builder()
                        .user(user)
                        .course(course)
                        .build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(UUID reviewId) {
        User user = getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
