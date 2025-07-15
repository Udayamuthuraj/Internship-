package com.example.demo.service.student;

import com.example.demo.dto.student.*;
import com.example.demo.model.student.Student;
import com.example.demo.repository.student.StudentRepository;
import com.example.demo.utils.JwtUtils;
import com.example.demo.utils.OTPStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentAuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private JwtUtils jwtUtils;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Registers a Student user if OTP is valid and email is not already registered.
     */
    public String registerStudent(StudentRegisterRequest request) {
        String email = request.getEmail().toLowerCase();

        if (studentRepository.existsByEmail(email)) {
            return "Email already registered.";
        }

        String storedOtp = otpStorageService.getOtp(email);
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            return "Invalid or expired OTP.";
        }

        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(email);
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setBatch(request.getBatch());
        student.setDepartment(request.getDepartment());

        // ✅ Set timestamps
        student.setRegisteredDate(LocalDate.now());
        student.setLastUpdated(LocalDateTime.now());

        studentRepository.save(student);
        otpStorageService.clearOtp(email);

        return "Student registered successfully.";
    }

    /**
     * Login method that returns JWT token and student info on success.
     */
    public StudentLoginResponse login(StudentLoginRequest request) {
        String email = request.getEmail().toLowerCase();
        Optional<Student> optionalStudent = studentRepository.findByEmail(email);

        if (optionalStudent.isEmpty()) {
            throw new RuntimeException("Email not found.");
        }

        Student student = optionalStudent.get();
        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        String token = jwtUtils.generateToken(student.getEmail());
        return new StudentLoginResponse(token, student.getName(), student.getEmail());
    }

    /**
     * Verifies OTP for registration or password reset.
     */
    public String verifyOtp(StudentVerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase();
        String storedOtp = otpStorageService.getOtp(email);

        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            return "Invalid or expired OTP.";
        }

        return "OTP verified successfully.";
    }

    /**
     * Resets the student's password after OTP verification.
     */
    public String resetPassword(StudentResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase();
        Optional<Student> optionalStudent = studentRepository.findByEmail(email);

        if (optionalStudent.isEmpty()) {
            return "Email not found.";
        }

        Student student = optionalStudent.get();
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // ✅ Update timestamp
        student.setLastUpdated(LocalDateTime.now());

        studentRepository.save(student);
        otpStorageService.clearOtp(email);

        return "Password reset successfully.";
    }

    /**
     * Checks if an email is already registered.
     */
    public boolean checkEmailExists(String email) {
        return studentRepository.existsByEmail(email.toLowerCase());
    }

    /**
     * 🔍 Get students by batch.
     */
    public List<Student> getStudentsByBatch(String batch) {
        return studentRepository.findByBatch(batch);
    }

    /**
     * 🔍 Get students by department.
     */
    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }
}
