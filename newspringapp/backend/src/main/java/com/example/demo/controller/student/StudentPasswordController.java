package com.example.demo.controller.student;

import com.example.demo.dto.student.StudentResetPasswordRequest;
import com.example.demo.service.student.StudentEmailService;
import com.example.demo.service.student.StudentAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/password")
public class StudentPasswordController {

    @Autowired
    private StudentEmailService studentEmailService;

    @Autowired
    private StudentAuthService studentAuthService;

    // ✅ Send OTP for Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        String result = studentEmailService.sendOtp(email);
        if (result.equals("OTP sent successfully.")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // ✅ Reset Password using verified OTP
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody StudentResetPasswordRequest request) {
        String result = studentAuthService.resetPassword(request);
        if (result.equals("Password reset successfully.")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
