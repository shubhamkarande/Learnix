package com.learnix.repository;

import com.learnix.model.Review;
import com.learnix.model.Course;
import com.learnix.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    
    Optional<Review> findByUserAndCourse(User user, Course course);
    
    boolean existsByUserAndCourse(User user, Course course);
    
    Page<Review> findByCourseOrderByCreatedAtDesc(Course course, Pageable pageable);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course = :course")
    Double getAverageRatingByCourse(Course course);
    
    long countByCourse(Course course);
}
