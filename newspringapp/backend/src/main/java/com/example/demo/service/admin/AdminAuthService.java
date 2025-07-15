package com.example.demo.service.admin;

import com.example.demo.dto.admin.*;
import com.example.demo.model.admin.Admin;
import com.example.demo.repository.admin.AdminRepository;
import com.example.demo.utils.JwtUtils;
import com.example.demo.utils.OTPStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class AdminAuthService {

    @Value("${admin.default-code}")
    private String defaultAdminCode;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OTPStorageService otpStorageService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * ✅ Register a new Admin with OTP verification
     */
    public String registerAdmin(AdminRegisterRequest request) {
        String email = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        String otp = request.getOtp() != null ? request.getOtp().trim() : "";

        if (!StringUtils.hasText(email) || !StringUtils.hasText(request.getName()) || !StringUtils.hasText(otp)) {
            return "Required fields are missing.";
        }

        if (!defaultAdminCode.equals(request.getAdminCode())) {
            return "Invalid admin code.";
        }

        if (adminRepository.existsByEmail(email)) {
            return "Email already registered.";
        }

        String storedOtp = otpStorageService.getOtp(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            return "Invalid or expired OTP.";
        }

        Admin admin = new Admin();
        admin.setName(request.getName().trim());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(request.getPassword()));

        adminRepository.save(admin);
        otpStorageService.clearOtp(email);

        return "Admin registered successfully.";
    }

    /**
     * ✅ Login and return JWT token if credentials are valid
     */
    public AdminLoginResponse login(AdminLoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        String password = request.getPassword();

        if (!StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            throw new RuntimeException("Email and password must be provided.");
        }

        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);
        if (optionalAdmin.isEmpty()) {
            throw new RuntimeException("Email not found.");
        }

        Admin admin = optionalAdmin.get();
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        String token = jwtUtils.generateToken(admin.getEmail());

        return new AdminLoginResponse(
                token,
                admin.getName(),
                admin.getEmail(),
                admin.getProfileImageUrl()
        );
    }

    /**
     * ✅ OTP verification (used during registration/forgot password)
     */
    public String verifyOtp(AdminVerifyOtpRequest request) {
        String email = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        String otp = request.getOtp() != null ? request.getOtp().trim() : "";

        if (!StringUtils.hasText(email) || !StringUtils.hasText(otp)) {
            return "Email and OTP are required.";
        }

        String storedOtp = otpStorageService.getOtp(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            return "Invalid or expired OTP.";
        }

        return "OTP verified successfully.";
    }

    /**
     * ✅ Reset admin password after OTP verification
     */
    public String resetPassword(AdminResetPasswordRequest request) {
        String email = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        String newPassword = request.getNewPassword();

        if (!StringUtils.hasText(email) || !StringUtils.hasText(newPassword)) {
            return "Email and new password must be provided.";
        }

        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);
        if (optionalAdmin.isEmpty()) {
            return "Email not found.";
        }

        Admin admin = optionalAdmin.get();
        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);

        otpStorageService.clearOtp(email);
        return "Password reset successfully.";
    }

    /**
     * ✅ Check if admin email already exists
     */
    public boolean checkEmailExists(String email) {
        if (!StringUtils.hasText(email)) return false;
        return adminRepository.existsByEmail(email.toLowerCase().trim());
    }
}
