package com.learnix.service;

import com.learnix.dto.LessonRequest;
import com.learnix.dto.CourseResponse;
import com.learnix.model.*;
import com.learnix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Transactional
    public CourseResponse.LessonDto createLesson(UUID courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        validateInstructorAccess(course);

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .videoPublicId(request.getVideoPublicId())
                .durationSeconds(request.getDurationSeconds())
                .orderIndex(request.getOrderIndex())
                .previewable(request.isPreviewable())
                .resourceUrl(request.getResourceUrl())
                .resourceName(request.getResourceName())
                .build();

        lesson = lessonRepository.save(lesson);
        updateCourseMeta(course);

        return mapToLessonDto(lesson, false, null);
    }

    @Transactional
    public CourseResponse.LessonDto createLessonInModule(UUID courseId, UUID moduleId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        com.learnix.model.Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        validateInstructorAccess(course);

        Lesson lesson = Lesson.builder()
                .course(course)
                .module(module)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .videoPublicId(request.getVideoPublicId())
                .durationSeconds(request.getDurationSeconds())
                .orderIndex(request.getOrderIndex())
                .previewable(request.isPreviewable())
                .resourceUrl(request.getResourceUrl())
                .resourceName(request.getResourceName())
                .build();

        lesson = lessonRepository.save(lesson);
        updateCourseMeta(course);

        return mapToLessonDto(lesson, false, null);
    }

    @Transactional
    public CourseResponse.LessonDto updateLesson(UUID lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        validateInstructorAccess(lesson.getCourse());

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        if (request.getVideoUrl() != null) {
            lesson.setVideoUrl(request.getVideoUrl());
        }
        if (request.getVideoPublicId() != null) {
            lesson.setVideoPublicId(request.getVideoPublicId());
        }
        lesson.setDurationSeconds(request.getDurationSeconds());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setPreviewable(request.isPreviewable());
        lesson.setResourceUrl(request.getResourceUrl());
        lesson.setResourceName(request.getResourceName());

        lesson = lessonRepository.save(lesson);
        updateCourseMeta(lesson.getCourse());

        return mapToLessonDto(lesson, false, null);
    }

    @Transactional
    public void deleteLesson(UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        validateInstructorAccess(lesson.getCourse());

        Course course = lesson.getCourse();
        lessonRepository.delete(lesson);
        updateCourseMeta(course);
    }

    @Transactional(readOnly = true)
    public CourseResponse.LessonDto getLesson(UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        User currentUser = getCurrentUser();
        Course course = lesson.getCourse();

        // Check if user is enrolled or instructor
        boolean isInstructor = course.getInstructor().getId().equals(currentUser.getId());
        boolean isEnrolled = enrollmentRepository.existsByStudentAndCourse(currentUser, course);

        if (!isEnrolled && !isInstructor && !lesson.isPreviewable()) {
            throw new RuntimeException("You must be enrolled to access this lesson");
        }

        // Get progress if enrolled
        LessonProgress progress = null;
        if (isEnrolled) {
            Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(currentUser, course)
                    .orElse(null);
            if (enrollment != null) {
                progress = lessonProgressRepository.findByEnrollmentAndLesson(enrollment, lesson)
                        .orElse(null);
            }
        }

        return mapToLessonDto(lesson, true, progress);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse.LessonDto> getPreviewLessons(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return lessonRepository.findByCourseAndPreviewableTrue(course)
                .stream()
                .map(l -> mapToLessonDto(l, true, null))
                .collect(Collectors.toList());
    }

    private void validateInstructorAccess(Course course) {
        User currentUser = getCurrentUser();
        if (!course.getInstructor().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not authorized to modify this course");
        }
    }

    private void updateCourseMeta(Course course) {
        List<Lesson> lessons = lessonRepository.findByCourseOrderByOrderIndexAsc(course);
        course.setTotalLessons(lessons.size());

        int totalDuration = lessons.stream()
                .mapToInt(Lesson::getDurationSeconds)
                .sum();
        course.setTotalDurationMinutes(totalDuration / 60);

        courseRepository.save(course);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CourseResponse.LessonDto mapToLessonDto(Lesson lesson, boolean includeVideoUrl, LessonProgress progress) {
        CourseResponse.LessonDto dto = CourseResponse.LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .durationSeconds(lesson.getDurationSeconds())
                .orderIndex(lesson.getOrderIndex())
                .previewable(lesson.isPreviewable())
                .build();

        if (includeVideoUrl) {
            dto.setVideoUrl(lesson.getVideoUrl());
        }

        if (progress != null) {
            dto.setCompleted(progress.isCompleted());
            dto.setWatchedSeconds(progress.getWatchedSeconds());
        }

        return dto;
    }
}
