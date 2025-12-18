package com.learnix.service;

import com.learnix.dto.CertificateResponse;
import com.learnix.model.Certificate;
import com.learnix.model.Course;
import com.learnix.model.Enrollment;
import com.learnix.model.User;
import com.learnix.repository.CertificateRepository;
import com.learnix.repository.CourseRepository;
import com.learnix.repository.EnrollmentRepository;
import com.learnix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<CertificateResponse> getUserCertificates() {
        User user = getCurrentUser();
        List<Certificate> certificates = certificateRepository.findByUserOrderByIssuedAtDesc(user);
        return certificates.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CertificateResponse getCertificate(UUID certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        return mapToResponse(certificate);
    }

    public CertificateResponse verifyCertificate(String certificateNumber) {
        Certificate certificate = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        return mapToResponse(certificate);
    }

    @Transactional
    public CertificateResponse issueCertificate(UUID courseId) {
        User user = getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if user has completed the course
        Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(user, course)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        if (!enrollment.isCompleted()) {
            throw new RuntimeException("You must complete the course to receive a certificate");
        }

        // Check if certificate already exists
        if (certificateRepository.existsByUserAndCourse(user, course)) {
            return mapToResponse(certificateRepository.findByUserAndCourse(user, course).get());
        }

        // Generate unique certificate number
        String certificateNumber = generateCertificateNumber(user, course);

        Certificate certificate = Certificate.builder()
                .user(user)
                .course(course)
                .certificateNumber(certificateNumber)
                .build();

        certificate = certificateRepository.save(certificate);
        return mapToResponse(certificate);
    }

    private String generateCertificateNumber(User user, Course course) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String userPart = user.getId().toString().substring(0, 4).toUpperCase();
        String coursePart = course.getId().toString().substring(0, 4).toUpperCase();
        return "LRNX-" + timestamp + "-" + userPart + "-" + coursePart;
    }

    private CertificateResponse mapToResponse(Certificate certificate) {
        return CertificateResponse.builder()
                .id(certificate.getId())
                .certificateNumber(certificate.getCertificateNumber())
                .issuedAt(certificate.getIssuedAt())
                .pdfUrl(certificate.getPdfUrl())
                .course(CertificateResponse.CourseInfo.builder()
                        .id(certificate.getCourse().getId())
                        .title(certificate.getCourse().getTitle())
                        .thumbnailUrl(certificate.getCourse().getThumbnailUrl())
                        .build())
                .user(CertificateResponse.UserInfo.builder()
                        .id(certificate.getUser().getId())
                        .name(certificate.getUser().getName())
                        .build())
                .build();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
