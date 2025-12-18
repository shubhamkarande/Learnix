package com.learnix.controller;

import com.learnix.dto.AdminStatsResponse;
import com.learnix.model.Course;
import com.learnix.model.Role;
import com.learnix.model.User;
import com.learnix.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size, sortBy, sortDir));
    }

    @GetMapping("/courses")
    public ResponseEntity<Page<Course>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(adminService.getAllCourses(page, size, sortBy, sortDir));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> request) {
        Role newRole = Role.valueOf(request.get("role").toUpperCase());
        return ResponseEntity.ok(adminService.updateUserRole(userId, newRole));
    }

    @PatchMapping("/courses/{courseId}/approve")
    public ResponseEntity<Course> approveCourse(
            @PathVariable UUID courseId,
            @RequestParam boolean approved) {
        return ResponseEntity.ok(adminService.approveCourse(courseId, approved));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID courseId) {
        adminService.deleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }
}
