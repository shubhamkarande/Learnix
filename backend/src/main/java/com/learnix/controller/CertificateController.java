package com.learnix.controller;

import com.learnix.dto.CertificateResponse;
import com.learnix.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getUserCertificates() {
        return ResponseEntity.ok(certificateService.getUserCertificates());
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> getCertificate(@PathVariable UUID certificateId) {
        return ResponseEntity.ok(certificateService.getCertificate(certificateId));
    }

    @GetMapping("/verify/{certificateNumber}")
    public ResponseEntity<CertificateResponse> verifyCertificate(@PathVariable String certificateNumber) {
        return ResponseEntity.ok(certificateService.verifyCertificate(certificateNumber));
    }

    @PostMapping("/issue/{courseId}")
    public ResponseEntity<CertificateResponse> issueCertificate(@PathVariable UUID courseId) {
        return ResponseEntity.ok(certificateService.issueCertificate(courseId));
    }
}
