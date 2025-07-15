package com.example.demo.service.alumni;

import com.example.demo.dto.alumni.AlumniResetPasswordRequest;
import com.example.demo.dto.alumni.AlumniVerifyOtpRequest;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import com.example.demo.utils.EmailService;
import com.example.demo.utils.OTPStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class AlumniPasswordService {

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Send OTP for Forgot Password
    public String sendForgotPasswordOtp(String email) {
        Optional<Alumni> optionalAlumni = alumniRepository.findByEmail(email);
        if (optionalAlumni.isEmpty()) {
            return "Alumni with this email does not exist.";
        }

        String otp = generateOtp();
        otpStorageService.storeOtp(email, otp);

        String subject = "Alumni Portal - Reset Password OTP";
        String body = "<p>Dear Alumni,</p>" +
                "<p>Your OTP for resetting your password is: <b>" + otp + "</b></p>" +
                "<p>Please use this OTP to reset your password. Do not share this OTP with anyone.</p>" +
                "<br><p>Regards,<br>Alumni Portal Team</p>";

        try {
            emailService.sendEmail(email, subject, body);
            return "OTP sent to your email.";
        } catch (Exception e) {
            return "Failed to send OTP email.";
        }
    }

    // Verify OTP
    public String verifyOtp(AlumniVerifyOtpRequest request) {
        String storedOtp = otpStorageService.getOtp(request.getEmail());
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            return "Invalid or expired OTP.";
        }
        return "OTP verified successfully.";
    }

    // Reset Password
    public String resetPassword(AlumniResetPasswordRequest request) {
        Optional<Alumni> optionalAlumni = alumniRepository.findByEmail(request.getEmail());
        if (optionalAlumni.isEmpty()) {
            return "Alumni with this email does not exist.";
        }

        Alumni alumni = optionalAlumni.get();
        alumni.setPassword(passwordEncoder.encode(request.getNewPassword()));
        alumniRepository.save(alumni);
        otpStorageService.clearOtp(request.getEmail());

        return "Password has been reset successfully.";
    }

    // Utility: Generate 6-digit OTP
    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
