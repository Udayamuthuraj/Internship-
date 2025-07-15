package com.example.demo.controller.alumni;

import com.example.demo.dto.alumni.AlumniResetPasswordRequest;
import com.example.demo.service.alumni.AlumniEmailService;
import com.example.demo.service.alumni.AlumniAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumni/password")
public class AlumniPasswordController {

    @Autowired
    private AlumniEmailService alumniEmailService;

    @Autowired
    private AlumniAuthService alumniAuthService;

    // ✅ Send OTP for Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        String result = alumniEmailService.sendOtp(email);
        if (result.equals("OTP sent successfully.")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // ✅ Reset Password using verified OTP
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody AlumniResetPasswordRequest request) {
        String result = alumniAuthService.resetPassword(request);
        if (result.equals("Password reset successfully.")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
