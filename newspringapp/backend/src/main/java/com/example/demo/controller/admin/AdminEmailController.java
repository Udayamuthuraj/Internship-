package com.example.demo.controller.admin;

import com.example.demo.dto.admin.AdminVerifyOtpRequest;
import com.example.demo.dto.admin.FeedbackReplyRequest;
import com.example.demo.service.admin.AdminEmailService;
import com.example.demo.service.admin.AdminPasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/email")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Slf4j
public class AdminEmailController {

    private final AdminEmailService adminEmailService;
    private final AdminPasswordService adminPasswordService; // ✅ use password service

    /**
     * ✅ Send OTP to Admin's Email
     */
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        if (!StringUtils.hasText(email)) {
            return ResponseEntity.badRequest().body("❌ Email must not be empty");
        }

        try {
            String result = adminEmailService.sendOtp(email.trim().toLowerCase());

            return result.toLowerCase().contains("success")
                    ? ResponseEntity.ok("✅ " + result)
                    : ResponseEntity.badRequest().body("❌ " + result);
        } catch (Exception ex) {
            log.error("❌ Exception while sending OTP: {}", ex.getMessage(), ex);
            return ResponseEntity.status(500).body("❌ Internal Server Error: " + ex.getMessage());
        }
    }

    /**
     * ✅ Verify OTP for registration or forgot-password
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody AdminVerifyOtpRequest request) {
        if (!StringUtils.hasText(request.getEmail()) || !StringUtils.hasText(request.getOtp())) {
            return ResponseEntity.badRequest().body("❌ Email and OTP must not be empty");
        }

        try {
            String result = adminPasswordService.verifyOtp(new AdminVerifyOtpRequest(
                    request.getEmail().trim().toLowerCase(),
                    request.getOtp().trim()
            ));

            return result.toLowerCase().contains("verified")
                    ? ResponseEntity.ok("✅ " + result)
                    : ResponseEntity.badRequest().body("❌ " + result);
        } catch (Exception ex) {
            log.error("❌ Exception while verifying OTP: {}", ex.getMessage(), ex);
            return ResponseEntity.status(500).body("❌ Internal Server Error: " + ex.getMessage());
        }
    }

    /**
     * ✅ Send reply to user feedback & store in DB
     */
    @PostMapping("/reply-feedback")
    public ResponseEntity<String> replyToFeedback(@RequestBody FeedbackReplyRequest request) {
        if (request.getFeedbackId() == null) {
            return ResponseEntity.badRequest().body("❌ Missing feedbackId");
        }
        if (!StringUtils.hasText(request.getEmail())) {
            return ResponseEntity.badRequest().body("❌ Missing or empty email");
        }
        if (!StringUtils.hasText(request.getMessage())) {
            return ResponseEntity.badRequest().body("❌ Missing or empty message");
        }

        try {
            String result = adminEmailService.sendReplyToFeedback(request);
            log.info("📨 Email service result: {}", result);

            return result.toLowerCase().contains("reply sent")
                    ? ResponseEntity.ok("✅ " + result)
                    : ResponseEntity.badRequest().body("❌ " + result);
        } catch (Exception e) {
            log.error("❌ Exception while replying to feedback: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("❌ Error sending reply: " + e.getMessage());
        }
    }
}
