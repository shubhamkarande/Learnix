package com.learnix.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private Module module;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String videoUrl;

    private String videoPublicId; // Cloudinary public ID

    @Builder.Default
    private int durationSeconds = 0;

    @Column(nullable = false)
    private int orderIndex;

    @Builder.Default
    private boolean previewable = false; // Free preview

    private String resourceUrl; // Downloadable resource

    private String resourceName;
}
