package com.learnix.controller;

import com.learnix.dto.ReviewRequest;
import com.learnix.model.Review;
import com.learnix.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses/{courseId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<Page<Review>> getCourseReviews(
            @PathVariable UUID courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getCourseReviews(courseId, page, size));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats(@PathVariable UUID courseId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", reviewService.getCourseAverageRating(courseId));
        stats.put("totalReviews", reviewService.getCourseReviewCount(courseId));
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<Review> createOrUpdateReview(
            @PathVariable UUID courseId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createOrUpdateReview(courseId, request));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID courseId,
            @PathVariable UUID reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
