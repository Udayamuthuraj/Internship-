package com.example.demo.controller.alumni;

import com.example.demo.service.alumni.AlumniEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "*")
public class AlumniEmailController {

    @Autowired
    private AlumniEmailService emailService;

    @Autowired
    private com.example.demo.repository.alumni.AlumniRepository alumniRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password/reset")
    public Map<String, Object> resetPasswordWithOtp(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) {
        Map<String, Object> response = new HashMap<>();

        boolean isValid = emailService.verifyOtp(email, otp);
        if (!isValid) {
            response.put("message", "Invalid or expired OTP");
            return response;
        }

        var alumniOpt = alumniRepository.findByUemail(email);
        if (alumniOpt.isEmpty()) {
            response.put("message", "No user found with this email");
            return response;
        }

        var alumni = alumniOpt.get();
        alumni.setUpassword(passwordEncoder.encode(newPassword));
        alumniRepository.save(alumni);
        emailService.clearOtp(email);

        response.put("message", "Password has been reset successfully");
        return response;
    }


    @PostMapping("/request-otp")
    public Map<String, Object> requestOtp(@RequestBody Map<String, String> body) {
        String email = body.get("uemail");
        String otp = emailService.sendOtpToEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "OTP sent to email");
        response.put("otp", otp); // REMOVE this line in production!
        return response;
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("uemail");
        String otp = body.get("otp");

        boolean valid = emailService.verifyOtp(email, otp);
        Map<String, Object> response = new HashMap<>();

        if (valid) {
            response.put("message", "OTP verified successfully");
        } else {
            response.put("message", "Invalid OTP");
        }
        return response;
    }
}

