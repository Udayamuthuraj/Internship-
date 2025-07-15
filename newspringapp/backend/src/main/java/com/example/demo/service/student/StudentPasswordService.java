package com.example.demo.service.student;

import com.example.demo.dto.student.StudentResetPasswordRequest;
import com.example.demo.dto.student.StudentVerifyOtpRequest;
import com.example.demo.model.student.Student;
import com.example.demo.repository.student.StudentRepository;
import com.example.demo.utils.EmailService;
import com.example.demo.utils.OTPStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class StudentPasswordService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Send OTP for Forgot Password
    public String sendForgotPasswordOtp(String email) {
        Optional<Student> optionalStudent = studentRepository.findByEmail(email);
        if (optionalStudent.isEmpty()) {
            return "Student with this email does not exist.";
        }

        String otp = generateOtp();
        otpStorageService.storeOtp(email, otp);

        String subject = "Alumni Connect Portal - Reset Password OTP";
        String body = "<p>Dear Student,</p>" +
                "<p>Your OTP for resetting your password is: <b>" + otp + "</b></p>" +
                "<p>Please use this OTP to reset your password. Do not share this OTP with anyone.</p>" +
                "<br><p>Regards,<br>Alumni Connect Portal Team</p>";

        try {
            emailService.sendEmail(email, subject, body);
            return "OTP sent to your email.";
        } catch (Exception e) {
            return "Failed to send OTP email.";
        }
    }

    // Verify OTP
    public String verifyOtp(StudentVerifyOtpRequest request) {
        String storedOtp = otpStorageService.getOtp(request.getEmail());
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            return "Invalid or expired OTP.";
        }
        return "OTP verified successfully.";
    }

    // Reset Password
    public String resetPassword(StudentResetPasswordRequest request) {
        Optional<Student> optionalStudent = studentRepository.findByEmail(request.getEmail());
        if (optionalStudent.isEmpty()) {
            return "Student with this email does not exist.";
        }

        Student student = optionalStudent.get();
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        studentRepository.save(student);
        otpStorageService.clearOtp(request.getEmail());

        return "Password has been reset successfully.";
    }

    // Utility: Generate 6-digit OTP
    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
