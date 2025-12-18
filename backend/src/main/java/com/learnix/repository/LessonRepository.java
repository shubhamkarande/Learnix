package com.learnix.repository;

import com.learnix.model.Lesson;
import com.learnix.model.Course;
import com.learnix.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    
    List<Lesson> findByCourseOrderByOrderIndexAsc(Course course);
    
    List<Lesson> findByModuleOrderByOrderIndexAsc(Module module);
    
    int countByCourse(Course course);
    
    List<Lesson> findByCourseAndPreviewableTrue(Course course);
}
