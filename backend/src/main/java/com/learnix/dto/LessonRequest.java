package com.learnix.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String videoUrl;
    
    private String videoPublicId;
    
    private int durationSeconds;
    
    private int orderIndex;
    
    private boolean previewable;
    
    private String resourceUrl;
    
    private String resourceName;
}
