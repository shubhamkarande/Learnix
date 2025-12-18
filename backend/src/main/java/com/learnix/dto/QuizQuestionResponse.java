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
public class QuizQuestionResponse {
    private UUID id;
    private String question;
    private List<String> options;
    private int orderIndex;
    // Note: correctOptionIndex is NOT included to prevent cheating
}
