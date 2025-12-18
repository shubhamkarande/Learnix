package com.learnix.repository;

import com.learnix.model.Module;
import com.learnix.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ModuleRepository extends JpaRepository<Module, UUID> {
    
    List<Module> findByCourseOrderByOrderIndexAsc(Course course);
    
    int countByCourse(Course course);
}
