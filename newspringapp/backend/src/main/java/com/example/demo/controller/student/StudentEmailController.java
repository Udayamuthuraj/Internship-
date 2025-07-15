package com.example.demo.controller.student;

import com.example.demo.dto.student.StudentVerifyOtpRequest;
import com.example.demo.service.student.StudentAuthService;
import com.example.demo.service.student.StudentEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/email")
public class StudentEmailController {

    @Autowired
    private StudentEmailService studentEmailService;

    @Autowired
    private StudentAuthService studentAuthService;

    // ✅ Send OTP to Student's Email
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email must not be empty");
        }
        try {
            String result = studentEmailService.sendOtp(email.trim());
            if ("OTP sent successfully.".equals(result)) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Internal Server Error: " + ex.getMessage());
        }
    }

    // ✅ Verify OTP for registration or forgot-password
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody StudentVerifyOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and OTP must not be empty");
        }
        try {
            String result = studentAuthService.verifyOtp(request);
            if ("OTP verified successfully.".equals(result)) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Internal Server Error: " + ex.getMessage());
        }
    }
}
