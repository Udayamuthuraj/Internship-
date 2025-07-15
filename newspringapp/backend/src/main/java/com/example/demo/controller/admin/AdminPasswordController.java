package com.example.demo.controller.admin;

import com.example.demo.dto.admin.AdminResetPasswordRequest;
import com.example.demo.service.admin.AdminPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/password")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminPasswordController {

    private final AdminPasswordService adminPasswordService;

    // ✅ Send OTP for Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        String result = adminPasswordService.sendForgotPasswordOtp(email);
        if (result.toLowerCase().contains("otp")) {
            return ResponseEntity.ok("✅ " + result);
        } else {
            return ResponseEntity.badRequest().body("❌ " + result);
        }
    }

    // ✅ Reset Password using verified OTP
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody AdminResetPasswordRequest request) {
        String result = adminPasswordService.resetPassword(request);
        if (result.toLowerCase().contains("success")) {
            return ResponseEntity.ok("✅ " + result);
        } else {
            return ResponseEntity.badRequest().body("❌ " + result);
        }
    }
}
