package com.learnix.repository;

import com.learnix.model.LessonProgress;
import com.learnix.model.Enrollment;
import com.learnix.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    
    Optional<LessonProgress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);
    
    List<LessonProgress> findByEnrollment(Enrollment enrollment);
    
    long countByEnrollmentAndCompletedTrue(Enrollment enrollment);
}
