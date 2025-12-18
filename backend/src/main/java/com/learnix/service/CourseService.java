package com.learnix.service;

import com.learnix.dto.CourseRequest;
import com.learnix.dto.CourseResponse;
import com.learnix.model.Course;
import com.learnix.model.Enrollment;
import com.learnix.model.Lesson;
import com.learnix.model.Role;
import com.learnix.model.User;
import com.learnix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Transactional(readOnly = true)
    public Page<CourseResponse> getAllPublishedCourses(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return courseRepository.findByPublishedTrueAndApprovedTrue(pageable)
                .map(this::mapToCourseResponse);
    }

    @Transactional(readOnly = true)
    public Page<CourseResponse> searchCourses(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return courseRepository.searchCourses(query, pageable)
                .map(this::mapToCourseResponse);
    }

    @Transactional(readOnly = true)
    public Page<CourseResponse> getCoursesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return courseRepository.findByCategory(category, pageable)
                .map(this::mapToCourseResponse);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getTopCourses(int limit) {
        return courseRepository.findTopCourses(PageRequest.of(0, limit))
                .stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getNewCourses(int limit) {
        return courseRepository.findNewCourses(PageRequest.of(0, limit))
                .stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return mapToCourseResponseWithDetails(course);
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        User instructor = getCurrentUser();

        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only instructors can create courses");
        }

        Course course = Course.builder()
                .instructor(instructor)
                .title(request.getTitle())
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .price(request.getPrice())
                .thumbnailUrl(request.getThumbnailUrl())
                .category(request.getCategory())
                .level(request.getLevel())
                .language(request.getLanguage())
                .published(false)
                .approved(true)
                .build();

        course = courseRepository.save(course);

        // Create modules and lessons if provided
        if (request.getModules() != null) {
            for (CourseRequest.ModuleRequest moduleRequest : request.getModules()) {
                com.learnix.model.Module module = com.learnix.model.Module.builder()
                        .course(course)
                        .title(moduleRequest.getTitle())
                        .description(moduleRequest.getDescription())
                        .orderIndex(moduleRequest.getOrderIndex())
                        .build();
                module = moduleRepository.save(module);

                if (moduleRequest.getLessons() != null) {
                    for (CourseRequest.LessonRequest lessonRequest : moduleRequest.getLessons()) {
                        Lesson lesson = Lesson.builder()
                                .course(course)
                                .module(module)
                                .title(lessonRequest.getTitle())
                                .description(lessonRequest.getDescription())
                                .videoUrl(lessonRequest.getVideoUrl())
                                .durationSeconds(lessonRequest.getDurationSeconds())
                                .orderIndex(lessonRequest.getOrderIndex())
                                .previewable(lessonRequest.isPreviewable())
                                .build();
                        lessonRepository.save(lesson);
                    }
                }
            }
        }

        updateCourseMeta(course);

        return mapToCourseResponse(course);
    }

    @Transactional
    public CourseResponse updateCourse(UUID id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User currentUser = getCurrentUser();
        if (!course.getInstructor().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not authorized to update this course");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setShortDescription(request.getShortDescription());
        course.setPrice(request.getPrice());
        if (request.getThumbnailUrl() != null) {
            course.setThumbnailUrl(request.getThumbnailUrl());
        }
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setLanguage(request.getLanguage());
        course.setPublished(request.isPublished());

        course = courseRepository.save(course);
        updateCourseMeta(course);

        return mapToCourseResponse(course);
    }

    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User currentUser = getCurrentUser();
        if (!course.getInstructor().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not authorized to delete this course");
        }

        courseRepository.delete(course);
    }

    @Transactional
    public CourseResponse publishCourse(UUID id, boolean publish) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User currentUser = getCurrentUser();
        if (!course.getInstructor().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not authorized to publish this course");
        }

        course.setPublished(publish);
        course = courseRepository.save(course);

        return mapToCourseResponse(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getInstructorCourses() {
        User instructor = getCurrentUser();
        return courseRepository.findByInstructor(instructor)
                .stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
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

    private CourseResponse mapToCourseResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .shortDescription(course.getShortDescription())
                .price(course.getPrice())
                .thumbnailUrl(course.getThumbnailUrl())
                .category(course.getCategory())
                .level(course.getLevel())
                .language(course.getLanguage())
                .published(course.isPublished())
                .approved(course.isApproved())
                .totalLessons(course.getTotalLessons())
                .totalDurationMinutes(course.getTotalDurationMinutes())
                .averageRating(course.getAverageRating())
                .totalRatings(course.getTotalRatings())
                .totalEnrollments(course.getTotalEnrollments())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .instructor(CourseResponse.InstructorDto.builder()
                        .id(course.getInstructor().getId())
                        .name(course.getInstructor().getName())
                        .avatarUrl(course.getInstructor().getAvatarUrl())
                        .headline(course.getInstructor().getHeadline())
                        .build())
                .build();
    }

    private CourseResponse mapToCourseResponseWithDetails(Course course) {
        CourseResponse response = mapToCourseResponse(course);

        // Get current user enrollment if authenticated
        try {
            User currentUser = getCurrentUser();
            Optional<Enrollment> enrollment = enrollmentRepository.findByStudentAndCourse(currentUser, course);

            if (enrollment.isPresent()) {
                response.setEnrolled(true);
                response.setProgressPercentage(enrollment.get().getProgressPercentage());
            }
        } catch (Exception e) {
            // User not authenticated
        }

        // Map modules with lessons
        List<com.learnix.model.Module> modules = moduleRepository.findByCourseOrderByOrderIndexAsc(course);
        response.setModules(modules.stream()
                .map(m -> CourseResponse.ModuleDto.builder()
                        .id(m.getId())
                        .title(m.getTitle())
                        .description(m.getDescription())
                        .orderIndex(m.getOrderIndex())
                        .lessons(m.getLessons().stream()
                                .map(this::mapToLessonDto)
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList()));

        // Map standalone lessons
        List<Lesson> standaloneLessons = lessonRepository.findByCourseOrderByOrderIndexAsc(course)
                .stream()
                .filter(l -> l.getModule() == null)
                .collect(Collectors.toList());
        response.setLessons(standaloneLessons.stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toList()));

        return response;
    }

    private CourseResponse.LessonDto mapToLessonDto(Lesson lesson) {
        return CourseResponse.LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .durationSeconds(lesson.getDurationSeconds())
                .orderIndex(lesson.getOrderIndex())
                .previewable(lesson.isPreviewable())
                // Video URL is only shown to enrolled students or preview lessons
                .videoUrl(lesson.isPreviewable() ? lesson.getVideoUrl() : null)
                .build();
    }
}
