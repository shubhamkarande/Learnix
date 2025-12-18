package com.learnix.controller;

import com.learnix.dto.EnrollmentResponse;
import com.learnix.dto.ProgressUpdateRequest;
import com.learnix.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(enrollmentService.enrollInCourse(courseId));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments() {
        return ResponseEntity.ok(enrollmentService.getMyEnrollments());
    }

    @GetMapping("/enrollments/in-progress")
    public ResponseEntity<List<EnrollmentResponse>> getInProgressEnrollments(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(enrollmentService.getInProgressEnrollments(limit));
    }

    @GetMapping("/enrollments/completed")
    public ResponseEntity<List<EnrollmentResponse>> getCompletedEnrollments() {
        return ResponseEntity.ok(enrollmentService.getCompletedEnrollments());
    }

    @PutMapping("/lessons/{lessonId}/progress")
    public ResponseEntity<EnrollmentResponse> updateLessonProgress(
            @PathVariable UUID lessonId,
            @Valid @RequestBody ProgressUpdateRequest request) {
        return ResponseEntity.ok(enrollmentService.updateLessonProgress(lessonId, request));
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<EnrollmentResponse> markLessonComplete(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(enrollmentService.markLessonComplete(lessonId));
    }
}
