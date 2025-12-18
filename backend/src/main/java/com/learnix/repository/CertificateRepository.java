package com.learnix.repository;

import com.learnix.model.Certificate;
import com.learnix.model.Course;
import com.learnix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    Optional<Certificate> findByUserAndCourse(User user, Course course);

    List<Certificate> findByUserOrderByIssuedAtDesc(User user);

    boolean existsByUserAndCourse(User user, Course course);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);
}
