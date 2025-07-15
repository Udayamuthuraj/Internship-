package com.example.demo.controller.alumni;

import com.example.demo.dto.alumni.AlumniVerifyOtpRequest;
import com.example.demo.service.alumni.AlumniAuthService;
import com.example.demo.service.alumni.AlumniEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumni/email")
public class AlumniEmailController {

    @Autowired
    private AlumniEmailService alumniEmailService;

    @Autowired
    private AlumniAuthService alumniAuthService;

    // ✅ Send OTP to Alumni's Email
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email must not be empty");
        }
        try {
            String result = alumniEmailService.sendOtp(email.trim());
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
    public ResponseEntity<String> verifyOtp(@RequestBody AlumniVerifyOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and OTP must not be empty");
        }
        try {
            String result = alumniAuthService.verifyOtp(request);
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
