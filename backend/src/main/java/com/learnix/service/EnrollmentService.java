package com.learnix.service;

import com.learnix.dto.EnrollmentResponse;
import com.learnix.dto.ProgressUpdateRequest;
import com.learnix.model.*;
import com.learnix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public EnrollmentResponse enrollInCourse(UUID courseId) {
        User student = getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if already enrolled
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        // Check if payment is completed for paid courses
        if (course.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
            boolean hasPaid = paymentRepository.existsByUserAndCourseAndStatus(
                    student, course, PaymentStatus.COMPLETED);
            if (!hasPaid) {
                throw new RuntimeException("Payment required for this course");
            }
        }

        Enrollment enrollment = Enrollment.builder()
                .course(course)
                .student(student)
                .progressPercentage(0)
                .completedLessons(0)
                .completed(false)
                .build();

        enrollment = enrollmentRepository.save(enrollment);

        // Update course enrollment count
        course.setTotalEnrollments(course.getTotalEnrollments() + 1);
        courseRepository.save(course);

        return mapToEnrollmentResponse(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyEnrollments() {
        User student = getCurrentUser();
        return enrollmentRepository.findByStudent(student)
                .stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getInProgressEnrollments(int limit) {
        User student = getCurrentUser();
        return enrollmentRepository.findInProgressByStudent(student, 
                org.springframework.data.domain.PageRequest.of(0, limit))
                .stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getCompletedEnrollments() {
        User student = getCurrentUser();
        return enrollmentRepository.findCompletedByStudent(student)
                .stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponse updateLessonProgress(UUID lessonId, ProgressUpdateRequest request) {
        User student = getCurrentUser();
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, lesson.getCourse())
                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

        // Get or create lesson progress
        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentAndLesson(enrollment, lesson)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .totalSeconds(lesson.getDurationSeconds())
                        .build());

        progress.setWatchedSeconds(request.getWatchedSeconds());
        
        if (request.isCompleted() && !progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
        }

        lessonProgressRepository.save(progress);

        // Update enrollment progress
        updateEnrollmentProgress(enrollment);

        return mapToEnrollmentResponse(enrollment);
    }

    @Transactional
    public EnrollmentResponse markLessonComplete(UUID lessonId) {
        User student = getCurrentUser();
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, lesson.getCourse())
                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentAndLesson(enrollment, lesson)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .totalSeconds(lesson.getDurationSeconds())
                        .build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progress.setWatchedSeconds(lesson.getDurationSeconds());
            lessonProgressRepository.save(progress);

            updateEnrollmentProgress(enrollment);
        }

        return mapToEnrollmentResponse(enrollment);
    }

    private void updateEnrollmentProgress(Enrollment enrollment) {
        long completedCount = lessonProgressRepository.countByEnrollmentAndCompletedTrue(enrollment);
        int totalLessons = lessonRepository.countByCourse(enrollment.getCourse());

        enrollment.setCompletedLessons((int) completedCount);
        
        if (totalLessons > 0) {
            int percentage = (int) ((completedCount * 100) / totalLessons);
            enrollment.setProgressPercentage(percentage);

            if (percentage >= 100 && !enrollment.isCompleted()) {
                enrollment.setCompleted(true);
                enrollment.setCompletedAt(LocalDateTime.now());
                // TODO: Generate certificate
            }
        }

        enrollment.setLastAccessedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment) {
        Course course = enrollment.getCourse();
        List<Lesson> lessons = lessonRepository.findByCourseOrderByOrderIndexAsc(course);
        
        // Find next incomplete lesson
        UUID nextLessonId = null;
        String nextLessonTitle = null;
        
        for (Lesson lesson : lessons) {
            LessonProgress progress = lessonProgressRepository
                    .findByEnrollmentAndLesson(enrollment, lesson)
                    .orElse(null);
            
            if (progress == null || !progress.isCompleted()) {
                nextLessonId = lesson.getId();
                nextLessonTitle = lesson.getTitle();
                break;
            }
        }

        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .courseThumbnailUrl(course.getThumbnailUrl())
                .instructorName(course.getInstructor().getName())
                .progressPercentage(enrollment.getProgressPercentage())
                .completedLessons(enrollment.getCompletedLessons())
                .totalLessons(course.getTotalLessons())
                .completed(enrollment.isCompleted())
                .enrolledAt(enrollment.getEnrolledAt())
                .completedAt(enrollment.getCompletedAt())
                .lastAccessedAt(enrollment.getLastAccessedAt())
                .certificateUrl(enrollment.getCertificateUrl())
                .certificateId(enrollment.getCertificateId())
                .nextLessonId(nextLessonId)
                .nextLessonTitle(nextLessonTitle)
                .build();
    }
}
