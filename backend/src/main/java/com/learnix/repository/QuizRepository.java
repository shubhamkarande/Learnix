package com.learnix.repository;

import com.learnix.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {

    List<Quiz> findByLessonId(UUID lessonId);

    Optional<Quiz> findByLessonIdAndId(UUID lessonId, UUID quizId);
}
