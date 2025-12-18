package com.learnix.dto;

import jakarta.validation.constraints.NotEmpty;
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
public class QuizSubmissionRequest {
    @NotEmpty(message = "Answers are required")
    private List<QuizAnswer> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizAnswer {
        private UUID questionId;
        private int selectedOptionIndex;
    }
}
