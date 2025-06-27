package com.example.demo.service.alumni;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AlumniEmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ⏳ Store OTP with expiry (2 mins = 120000 ms)
    private static final long OTP_VALID_DURATION = 2 * 60 * 1000;

    private static class OtpInfo {
        String otp;
        long expiryTime;

        OtpInfo(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    private Map<String, OtpInfo> otpStorage = new HashMap<>();

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public String sendOtpToEmail(String toEmail) {
        String otp = generateOtp();
        long expiryTime = System.currentTimeMillis() + OTP_VALID_DURATION;
        otpStorage.put(toEmail, new OtpInfo(otp, expiryTime));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("udhai0109@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Alumni Portal - OTP Verification");
        message.setText("Your OTP is: " + otp + "\nIt is valid for 2 minutes.");

        mailSender.send(message);

        return otp; // ⚠️ REMOVE IN PRODUCTION
    }

    public boolean verifyOtp(String email, String inputOtp) {
        if (!otpStorage.containsKey(email)) return false;

        OtpInfo info = otpStorage.get(email);
        if (System.currentTimeMillis() > info.expiryTime) {
            otpStorage.remove(email); // expired
            return false;
        }

        return info.otp.equals(inputOtp);
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}
