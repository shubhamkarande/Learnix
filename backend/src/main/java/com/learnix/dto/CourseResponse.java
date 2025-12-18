package com.learnix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private UUID id;
    private String title;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private String thumbnailUrl;
    private String category;
    private String level;
    private String language;
    private boolean published;
    private boolean approved;
    private int totalLessons;
    private int totalDurationMinutes;
    private double averageRating;
    private int totalRatings;
    private int totalEnrollments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private InstructorDto instructor;
    private List<ModuleDto> modules;
    private List<LessonDto> lessons;
    
    // Enrollment info for authenticated user
    private boolean enrolled;
    private Integer progressPercentage;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InstructorDto {
        private UUID id;
        private String name;
        private String avatarUrl;
        private String headline;
        private String bio;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleDto {
        private UUID id;
        private String title;
        private String description;
        private int orderIndex;
        private List<LessonDto> lessons;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonDto {
        private UUID id;
        private String title;
        private String description;
        private String videoUrl; // Only shown to enrolled students
        private int durationSeconds;
        private int orderIndex;
        private boolean previewable;
        private boolean completed; // For enrolled students
        private int watchedSeconds;
    }
}
