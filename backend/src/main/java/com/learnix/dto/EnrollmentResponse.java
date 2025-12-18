package com.learnix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private UUID id;
    private UUID courseId;
    private String courseTitle;
    private String courseThumbnailUrl;
    private String instructorName;
    private int progressPercentage;
    private int completedLessons;
    private int totalLessons;
    private boolean completed;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private LocalDateTime lastAccessedAt;
    private String certificateUrl;
    private String certificateId;
    
    // Next lesson to continue
    private UUID nextLessonId;
    private String nextLessonTitle;
}
