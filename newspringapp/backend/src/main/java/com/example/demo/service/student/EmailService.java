package com.example.demo.service.student;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
     @Autowired
    private JavaMailSender mailSender;
    private final Map<String, String> otpStorage = new HashMap<>();

    // Generate and send OTP
    public String sendOtpEmail(String to) {
        String otp = generateOtp();
        // In real scenario, send email logic goes here
        otpStorage.put(to, otp); // Store OTP against email

        String subject = "Your OTP for CSiTAA Registration";
        String body = "Hello,\n\nYour OTP is: " + otp + "\n\nRegards,\n CSITAA - University of Madras";
        // Email sending logic
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);  // <-- This sends the email!

        return otp;
    }

    // ✅ Verify OTP and optionally invalidate it after success
        public boolean verifyOtp(String to, String otp) {
            String storedOtp = otpStorage.get(to);

            // 🔍 Debug logs
            System.out.println("🔍 Verifying OTP...");
            System.out.println("Email (to): " + to);
            System.out.println("User-entered OTP: " + otp);
            System.out.println("Stored OTP: " + storedOtp);

            if (storedOtp != null && storedOtp.equals(otp)) {
                otpStorage.remove(to);
                return true;
            }
            return false;
        }


    // OTP generator (6-digit)
    private String generateOtp() {
        Random random = new Random();
        int otpInt = 100000 + random.nextInt(900000); // 6-digit
        return String.valueOf(otpInt);
    }
}
