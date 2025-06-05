package com.example.demo.controller.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.student.EmailService;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send-otp")
    public String sendOtp(@RequestParam String to) {
        String otp = emailService.sendOtpEmail(to);
        return "OTP sent to: " + to + " | OTP: " + otp + " Welcome to CSiTAA of University of Madras ";
    }

    @GetMapping("/verify-otp")
    public boolean verifyOtp(@RequestParam String to, @RequestParam String otp) {
        return emailService.verifyOtp(to, otp);
    }
}
