package com.learnix.service;

import com.learnix.dto.*;
import com.learnix.model.Quiz;
import com.learnix.model.QuizQuestion;
import com.learnix.repository.QuizQuestionRepository;
import com.learnix.repository.QuizRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    public List<QuizResponse> getQuizzesByLesson(UUID lessonId) {
        List<Quiz> quizzes = quizRepository.findByLessonId(lessonId);
        return quizzes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public QuizResponse getQuizById(UUID quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return mapToResponse(quiz);
    }

    @Transactional
    public QuizResultResponse submitQuiz(UUID quizId, QuizSubmissionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<QuizQuestion> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);

        // Create a map of question ID to submission
        Map<UUID, Integer> answerMap = request.getAnswers().stream()
                .collect(Collectors.toMap(
                        QuizSubmissionRequest.QuizAnswer::getQuestionId,
                        QuizSubmissionRequest.QuizAnswer::getSelectedOptionIndex));

        List<QuizResultResponse.QuestionResult> results = new ArrayList<>();
        int correctCount = 0;

        for (QuizQuestion question : questions) {
            Integer selectedIndex = answerMap.get(question.getId());
            boolean isCorrect = selectedIndex != null && selectedIndex == question.getCorrectOptionIndex();

            if (isCorrect) {
                correctCount++;
            }

            results.add(QuizResultResponse.QuestionResult.builder()
                    .questionId(question.getId())
                    .question(question.getQuestion())
                    .selectedOptionIndex(selectedIndex != null ? selectedIndex : -1)
                    .correctOptionIndex(question.getCorrectOptionIndex())
                    .correct(isCorrect)
                    .explanation(question.getExplanation())
                    .build());
        }

        int scorePercentage = questions.isEmpty() ? 0 : (correctCount * 100) / questions.size();
        boolean passed = scorePercentage >= quiz.getPassingScore();

        return QuizResultResponse.builder()
                .quizId(quizId)
                .totalQuestions(questions.size())
                .correctAnswers(correctCount)
                .scorePercentage(scorePercentage)
                .passed(passed)
                .passingScore(quiz.getPassingScore())
                .results(results)
                .build();
    }

    private QuizResponse mapToResponse(Quiz quiz) {
        List<QuizQuestion> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());

        List<QuizQuestionResponse> questionResponses = questions.stream()
                .map(q -> QuizQuestionResponse.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .options(parseOptions(q.getOptions()))
                        .orderIndex(q.getOrderIndex())
                        .build())
                .collect(Collectors.toList());

        return QuizResponse.builder()
                .id(quiz.getId())
                .lessonId(quiz.getLesson().getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .passingScore(quiz.getPassingScore())
                .totalQuestions(questions.size())
                .questions(questionResponses)
                .build();
    }

    private List<String> parseOptions(String optionsJson) {
        try {
            return objectMapper.readValue(optionsJson, new TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return List.of();
        }
    }
}
