package com.learnix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {
    private UUID quizId;
    private int totalQuestions;
    private int correctAnswers;
    private int scorePercentage;
    private boolean passed;
    private int passingScore;
    private List<QuestionResult> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResult {
        private UUID questionId;
        private String question;
        private int selectedOptionIndex;
        private int correctOptionIndex;
        private boolean correct;
        private String explanation;
    }
}
