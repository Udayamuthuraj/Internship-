package com.example.demo.controller.admin;

import com.example.demo.dto.admin.AdminLoginRequest;
import com.example.demo.dto.admin.AdminLoginResponse;
import com.example.demo.dto.admin.AdminRegisterRequest;
import com.example.demo.service.admin.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    /**
     * Registers a new admin with admin code and OTP verification.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody AdminRegisterRequest request) {
        try {
            String result = adminAuthService.registerAdmin(request);
            if (result.toLowerCase().contains("success")) {
                return ResponseEntity.ok("✅ " + result);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ " + result);
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Internal Server Error: " + ex.getMessage());
        }
    }

    /**
     * Logs in the admin and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminLoginRequest request) {
        try {
            AdminLoginResponse response = adminAuthService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ Login failed: " + e.getMessage());
        }
    }

    /**
     * Checks if email is already registered (frontend validation).
     */
    @GetMapping("/email-exists")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        boolean exists = adminAuthService.checkEmailExists(email);
        return ResponseEntity.ok(exists);
    }
}
