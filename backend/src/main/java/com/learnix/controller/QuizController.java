package com.learnix.controller;

import com.learnix.dto.QuizResponse;
import com.learnix.dto.QuizResultResponse;
import com.learnix.dto.QuizSubmissionRequest;
import com.learnix.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/lessons/{lessonId}/quizzes")
    public ResponseEntity<List<QuizResponse>> getQuizzesByLesson(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(quizService.getQuizzesByLesson(lessonId));
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable UUID quizId) {
        return ResponseEntity.ok(quizService.getQuizById(quizId));
    }

    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @PathVariable UUID quizId,
            @Valid @RequestBody QuizSubmissionRequest request) {
        return ResponseEntity.ok(quizService.submitQuiz(quizId, request));
    }
}
