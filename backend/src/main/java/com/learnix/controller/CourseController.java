package com.learnix.controller;

import com.learnix.dto.CourseRequest;
import com.learnix.dto.CourseResponse;
import com.learnix.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<CourseResponse>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(courseService.getAllPublishedCourses(page, size, sortBy, sortDir));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CourseResponse>> searchCourses(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(courseService.searchCourses(query, page, size));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<CourseResponse>> getCoursesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(courseService.getCoursesByCategory(category, page, size));
    }

    @GetMapping("/top")
    public ResponseEntity<List<CourseResponse>> getTopCourses(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(courseService.getTopCourses(limit));
    }

    @GetMapping("/new")
    public ResponseEntity<List<CourseResponse>> getNewCourses(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(courseService.getNewCourses(limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.createCourse(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<CourseResponse> publishCourse(
            @PathVariable UUID id,
            @RequestParam boolean publish) {
        return ResponseEntity.ok(courseService.publishCourse(id, publish));
    }
}
