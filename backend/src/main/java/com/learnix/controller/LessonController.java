package com.learnix.controller;

import com.learnix.dto.CourseResponse;
import com.learnix.dto.LessonRequest;
import com.learnix.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<CourseResponse.LessonDto> createLesson(
            @PathVariable UUID courseId,
            @Valid @RequestBody LessonRequest request) {
        return ResponseEntity.ok(lessonService.createLesson(courseId, request));
    }

    @PostMapping("/courses/{courseId}/modules/{moduleId}/lessons")
    public ResponseEntity<CourseResponse.LessonDto> createLessonInModule(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @Valid @RequestBody LessonRequest request) {
        return ResponseEntity.ok(lessonService.createLessonInModule(courseId, moduleId, request));
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<CourseResponse.LessonDto> updateLesson(
            @PathVariable UUID id,
            @Valid @RequestBody LessonRequest request) {
        return ResponseEntity.ok(lessonService.updateLesson(id, request));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<CourseResponse.LessonDto> getLesson(@PathVariable UUID id) {
        return ResponseEntity.ok(lessonService.getLesson(id));
    }

    @GetMapping("/courses/{courseId}/lessons/preview")
    public ResponseEntity<List<CourseResponse.LessonDto>> getPreviewLessons(
            @PathVariable UUID courseId) {
        return ResponseEntity.ok(lessonService.getPreviewLessons(courseId));
    }
}
