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
public class QuizResponse {
    private UUID id;
    private UUID lessonId;
    private String title;
    private String description;
    private int passingScore;
    private int totalQuestions;
    private List<QuizQuestionResponse> questions;
}
