package com.example.demo.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPStorageService {

    @Value("${otp.expiration.minutes:15}")
    private int otpExpirationMinutes;

    @Value("${otp.length:6}")
    private int otpLength;

    private static final SecureRandom secureRandom = new SecureRandom();

    private static final class OTPEntry {
        private final String otp;
        private final LocalDateTime timestamp;

        OTPEntry(String otp) {
            this.otp = otp;
            this.timestamp = LocalDateTime.now();
        }

        boolean isExpired(int expiryMinutes) {
            return timestamp.plusMinutes(expiryMinutes).isBefore(LocalDateTime.now());
        }

        public String getOtp() {
            return otp;
        }
    }

    private final Map<String, OTPEntry> otpMap = new ConcurrentHashMap<>();

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    public void storeOtp(String email, String otp) {
        email = normalizeEmail(email);
        otpMap.put(email, new OTPEntry(otp));
    }

    public String generateOTP(String email) {
        email = normalizeEmail(email);
        int max = (int) Math.pow(10, otpLength);
        String otp = String.format("%0" + otpLength + "d", secureRandom.nextInt(max));
        storeOtp(email, otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        email = normalizeEmail(email);
        OTPEntry entry = otpMap.get(email);
        if (entry == null || entry.isExpired(otpExpirationMinutes)) {
            otpMap.remove(email);
            return false;
        }

        boolean isValid = entry.getOtp().equals(otp);
        if (isValid) {
            otpMap.remove(email); // One-time use
        }
        return isValid;
    }

    public boolean hasOtp(String email) {
        email = normalizeEmail(email);
        OTPEntry entry = otpMap.get(email);
        return entry != null && !entry.isExpired(otpExpirationMinutes);
    }

    public String getOtp(String email) {
        email = normalizeEmail(email);
        OTPEntry entry = otpMap.get(email);
        if (entry == null || entry.isExpired(otpExpirationMinutes)) {
            otpMap.remove(email);
            return null;
        }
        return entry.getOtp();
    }

    public void clearOtp(String email) {
        email = normalizeEmail(email);
        otpMap.remove(email);
    }

    public Map<String, String> getOtpEmailMap() {
        Map<String, String> activeOtps = new ConcurrentHashMap<>();
        for (Map.Entry<String, OTPEntry> entry : otpMap.entrySet()) {
            if (!entry.getValue().isExpired(otpExpirationMinutes)) {
                activeOtps.put(entry.getKey(), entry.getValue().getOtp());
            }
        }
        return activeOtps;
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanExpiredOtps() {
        otpMap.entrySet().removeIf(entry -> entry.getValue().isExpired(otpExpirationMinutes));
    }
}
