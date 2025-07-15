package com.example.demo.controller.admin;

import com.example.demo.dto.admin.AdminEmailOtpVerifyRequest;
import com.example.demo.dto.admin.AdminEmailUpdateRequest;
import com.example.demo.dto.admin.AdminProfileUpdateRequest;
import com.example.demo.service.admin.AdminProfileService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // ✅ Replace with your production domain
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    /**
     * ✅ Update admin's name and/or profile image.
     */
    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestPart("data") AdminProfileUpdateRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            request.setProfileImage(profileImage);
            Map<String, String> updatedAdmin = adminProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedAdmin);
        } catch (IOException e) {
            log.error("❌ Failed to update profile image: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to update profile image."));
        } catch (RuntimeException e) {
            log.error("❌ Error updating admin profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Send OTP to new email address.
     */
    @PostMapping("/request-email-change")
    public ResponseEntity<?> requestEmailChange(@RequestBody AdminEmailUpdateRequest request) {
        try {
            adminProfileService.requestEmailChange(request);
            return ResponseEntity.ok(Map.of("message", "OTP sent to new email address."));
        } catch (MessagingException | RuntimeException e) {
            log.error("❌ Failed to send OTP for email change: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Verify OTP and update email.
     */
    @PostMapping("/verify-email-change")
    public ResponseEntity<?> verifyEmailChange(@RequestBody AdminEmailOtpVerifyRequest request) {
        try {
            Map<String, String> updatedAdmin = adminProfileService.verifyAndChangeEmail(request);
            return ResponseEntity.ok(updatedAdmin);
        } catch (RuntimeException e) {
            log.error("❌ Email verification failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
