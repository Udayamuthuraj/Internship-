package com.example.demo.service.student;

import com.example.demo.utils.EmailService;
import com.example.demo.utils.OTPStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class StudentEmailService {

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Send OTP to Student's Email
    public String sendOtp(String email) {
        String otp = generateOtp();
        otpStorageService.storeOtp(email, otp);

        String subject = "Alumni Connect Portal - OTP Verification";
        String body = "<p>Dear Student,</p>" +
                "<p>Your OTP for verification is: <b>" + otp + "</b></p>" +
                "<p>This OTP is valid for a limited time. Please do not share it with anyone.</p>" +
                "<br><p>Regards,<br>Alumni Connect Portal Team</p>";

        try {
            emailService.sendEmail(email, subject, body);
            return "OTP sent successfully.";
        } catch (Exception e) {
            return "Failed to send OTP. Please try again.";
        }
    }

    // Generate 6-digit OTP
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit number
        return String.valueOf(otp);
    }
}
