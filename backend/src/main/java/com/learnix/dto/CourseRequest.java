package com.learnix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String shortDescription;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private String thumbnailUrl;
    
    private String category;
    
    private String level;
    
    private String language;
    
    private boolean published;
    
    private List<ModuleRequest> modules;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleRequest {
        private String title;
        private String description;
        private int orderIndex;
        private List<LessonRequest> lessons;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonRequest {
        private String title;
        private String description;
        private String videoUrl;
        private int durationSeconds;
        private int orderIndex;
        private boolean previewable;
    }
}
