package com.learnix.repository;

import com.learnix.model.Enrollment;
import com.learnix.model.Course;
import com.learnix.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    
    boolean existsByStudentAndCourse(User student, Course course);
    
    List<Enrollment> findByStudent(User student);
    
    Page<Enrollment> findByStudent(User student, Pageable pageable);
    
    List<Enrollment> findByCourse(Course course);
    
    Page<Enrollment> findByCourse(Course course, Pageable pageable);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student = :student AND e.completed = false " +
           "ORDER BY e.lastAccessedAt DESC")
    List<Enrollment> findInProgressByStudent(@Param("student") User student, Pageable pageable);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student = :student AND e.completed = true")
    List<Enrollment> findCompletedByStudent(@Param("student") User student);
    
    long countByCourse(Course course);
    
    long countByStudent(User student);
    
    long countByCompletedTrue();
}
