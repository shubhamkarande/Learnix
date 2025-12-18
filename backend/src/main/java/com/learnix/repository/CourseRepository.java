package com.learnix.repository;

import com.learnix.model.Course;
import com.learnix.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    
    List<Course> findByInstructor(User instructor);
    
    Page<Course> findByInstructor(User instructor, Pageable pageable);
    
    Page<Course> findByPublishedTrueAndApprovedTrue(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND c.approved = true " +
           "AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Course> searchCourses(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND c.approved = true " +
           "AND c.category = :category")
    Page<Course> findByCategory(@Param("category") String category, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND c.approved = true " +
           "ORDER BY c.totalEnrollments DESC")
    List<Course> findTopCourses(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND c.approved = true " +
           "ORDER BY c.createdAt DESC")
    List<Course> findNewCourses(Pageable pageable);
    
    long countByPublishedTrue();
    
    long countByInstructor(User instructor);
}
