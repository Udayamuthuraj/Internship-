package com.example.demo.service.admin;

import com.example.demo.dto.admin.AdminResetPasswordRequest;
import com.example.demo.dto.admin.AdminVerifyOtpRequest;
import com.example.demo.model.admin.Admin;
import com.example.demo.repository.admin.AdminRepository;
import com.example.demo.utils.EmailService;
import com.example.demo.utils.OTPStorageService;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class AdminPasswordService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Sends an OTP to the admin's email for password reset.
     */
    public String sendForgotPasswordOtp(String email) {
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);
        if (optionalAdmin.isEmpty()) {
            return "No administrator account found with the provided email address.";
        }

        String otp = otpStorageService.generateOTP(email);

        String subject = "Password Reset Request – Alumni Connect Portal";
        String body = String.format("""
            <p>Dear Admin,</p>
            <p>We received a request to reset your password. Please use the OTP below to proceed:</p>
            <h2>%s</h2>
            <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
            <p>If you did not initiate this request, we recommend securing your account immediately.</p>
            <br>
            <p>Regards,<br><strong>Alumni Connect Portal Team</strong></p>
        """, otp);

        try {
            emailService.sendEmail(email, subject, body);
            return "An OTP has been sent to your registered email address.";
        } catch (MessagingException e) {
            log.error("❌ Failed to send password reset OTP to {}: {}", email, e.getMessage());
            return "Failed to send OTP email. Please try again later.";
        }
    }

    /**
     * Verifies the OTP entered by the admin.
     */
    public String verifyOtp(AdminVerifyOtpRequest request) {
        boolean valid = otpStorageService.verifyOtp(request.getEmail(), request.getOtp());
        return valid ? "OTP verified successfully." : "The OTP is invalid or has expired.";
    }

    /**
     * Updates the admin's password after verifying OTP.
     */
    public String resetPassword(AdminResetPasswordRequest request) {
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isEmpty()) {
            return "No administrator account found with the provided email address.";
        }

        Admin admin = optionalAdmin.get();
        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);
        otpStorageService.clearOtp(request.getEmail());

        return "Your password has been successfully updated.";
    }
}
