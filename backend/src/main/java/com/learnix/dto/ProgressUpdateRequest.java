package com.learnix.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdateRequest {
    
    private int watchedSeconds;
    
    @Min(0)
    @Max(100)
    private int progressPercentage;
    
    private boolean completed;
}
