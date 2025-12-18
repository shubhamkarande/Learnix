package com.learnix.service;

import com.learnix.dto.AdminStatsResponse;
import com.learnix.model.Course;
import com.learnix.model.Role;
import com.learnix.model.User;
import com.learnix.repository.CourseRepository;
import com.learnix.repository.EnrollmentRepository;
import com.learnix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalInstructors(userRepository.countByRole(Role.INSTRUCTOR))
                .totalCourses(courseRepository.count())
                .publishedCourses(courseRepository.countByPublishedTrue())
                .totalEnrollments(enrollmentRepository.count())
                .completedEnrollments(enrollmentRepository.countByCompletedTrue())
                .build();
    }

    public Page<User> getAllUsers(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return userRepository.findAll(PageRequest.of(page, size, sort));
    }

    public Page<Course> getAllCourses(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return courseRepository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional
    public User updateUserRole(UUID userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    @Transactional
    public Course approveCourse(UUID courseId, boolean approved) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setPublished(approved);
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot delete admin users");
        }

        userRepository.delete(user);
    }

    @Transactional
    public void deleteCourse(UUID courseId) {
        courseRepository.deleteById(courseId);
    }
}
