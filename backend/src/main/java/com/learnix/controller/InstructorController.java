package com.learnix.controller;

import com.learnix.dto.CourseResponse;
import com.learnix.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final CourseService courseService;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getInstructorCourses() {
        return ResponseEntity.ok(courseService.getInstructorCourses());
    }
}
