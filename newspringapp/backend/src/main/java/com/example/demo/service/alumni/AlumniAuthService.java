package com.example.demo.service.alumni;

import com.example.demo.dto.alumni.AlumniLoginRequest;
import com.example.demo.dto.alumni.AlumniLoginResponse;
import com.example.demo.dto.alumni.AlumniRegisterRequest;
import com.example.demo.dto.alumni.AlumniResetPasswordRequest;
import com.example.demo.dto.alumni.AlumniVerifyOtpRequest;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
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
public class AlumniAuthService {

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private JwtUtils jwtUtils;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // =============================
    //        Register Alumni
    // =============================
    public String registerAlumni(AlumniRegisterRequest request) {
        String email = request.getEmail().toLowerCase();

        if (alumniRepository.existsByEmail(email)) {
            return "Email already registered.";
        }

        String storedOtp = otpStorageService.getOtp(email);
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            return "Invalid or expired OTP.";
        }

        Alumni alumni = new Alumni();
        alumni.setName(request.getName());
        alumni.setEmail(email);
        alumni.setPassword(passwordEncoder.encode(request.getPassword()));
        alumni.setBatch(request.getBatch());
        alumni.setDepartment(request.getDepartment());

        alumni.setRegisteredDate(LocalDate.now());
        alumni.setLastUpdated(LocalDateTime.now());

        alumniRepository.save(alumni);
        otpStorageService.clearOtp(email);

        return "Alumni registered successfully.";
    }

    // =============================
    //        Login Alumni
    // =============================
    public AlumniLoginResponse login(AlumniLoginRequest request) {
        String email = request.getEmail().toLowerCase();
        Optional<Alumni> optionalAlumni = alumniRepository.findByEmail(email);

        if (optionalAlumni.isEmpty()) {
            throw new RuntimeException("Email not found.");
        }

        Alumni alumni = optionalAlumni.get();
        if (!passwordEncoder.matches(request.getPassword(), alumni.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        String token = jwtUtils.generateToken(alumni.getEmail());
        return new AlumniLoginResponse(token, alumni.getName(), alumni.getEmail());
    }

    // =============================
    //        Verify OTP
    // =============================
    public String verifyOtp(AlumniVerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase();
        String storedOtp = otpStorageService.getOtp(email);

        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            return "Invalid or expired OTP.";
        }

        return "OTP verified successfully.";
    }

    // =============================
    //       Reset Password
    // =============================
    public String resetPassword(AlumniResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase();
        Optional<Alumni> optionalAlumni = alumniRepository.findByEmail(email);

        if (optionalAlumni.isEmpty()) {
            return "Email not found.";
        }

        Alumni alumni = optionalAlumni.get();
        alumni.setPassword(passwordEncoder.encode(request.getNewPassword()));
        alumni.setLastUpdated(LocalDateTime.now());

        alumniRepository.save(alumni);
        otpStorageService.clearOtp(email);
        return "Password reset successfully.";
    }

    // =============================
    //     Email Existence Check
    // =============================
    public boolean checkEmailExists(String email) {
        return alumniRepository.existsByEmail(email.toLowerCase());
    }

    // =============================
    //       Filter by Batch
    // =============================
    public List<Alumni> getAlumniByBatch(String batch) {
        return alumniRepository.findByBatch(batch);
    }

    // =============================
    //     Filter by Department
    // =============================
    public List<Alumni> getAlumniByDepartment(String department) {
        return alumniRepository.findByDepartment(department);
    }
}
