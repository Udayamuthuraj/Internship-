package com.example.demo.service.admin;

import com.example.demo.dto.admin.AdminEmailOtpVerifyRequest;
import com.example.demo.dto.admin.AdminEmailUpdateRequest;
import com.example.demo.dto.admin.AdminProfileUpdateRequest;
import com.example.demo.model.admin.Admin;
import com.example.demo.repository.admin.AdminRepository;
import com.example.demo.utils.EmailService;
import com.example.demo.utils.OTPStorageService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminProfileService {

    private final AdminRepository adminRepository;
    private final EmailService emailService;
    private final OTPStorageService otpStorageService;

    @Value("${upload.directory.profile}")
    private String uploadDir;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * ✅ Update admin's name or profile image.
     */
    public Map<String, String> updateProfile(AdminProfileUpdateRequest request) throws IOException {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + request.getEmail()));

        if (request.getNewName() != null && !request.getNewName().isBlank()) {
            admin.setName(request.getNewName());
        }

        MultipartFile image = request.getProfileImage();
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            admin.setProfileImageUrl(imagePath);
        }

        adminRepository.save(admin);
        log.info("✅ Admin profile updated for {}", admin.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("name", admin.getName());
        response.put("email", admin.getEmail());
        if (admin.getProfileImageUrl() != null) {
            response.put("profileImageUrl", baseUrl + admin.getProfileImageUrl());
        }

        return response;
    }

    /**
     * ✅ Step 1: Send OTP to new email for verification.
     */
    public void requestEmailChange(AdminEmailUpdateRequest request) throws MessagingException {
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(request.getCurrentEmail());
        if (optionalAdmin.isEmpty()) {
            throw new RuntimeException("Admin not found with email: " + request.getCurrentEmail());
        }

        if (adminRepository.existsByEmail(request.getNewEmail())) {
            throw new RuntimeException("New email already exists in the system.");
        }

        String otp = otpStorageService.generateOTP(request.getNewEmail());
        emailService.sendOtpEmail(request.getNewEmail(), otp);
        log.info("📧 OTP sent to new email: {}", request.getNewEmail());
    }

    /**
     * ✅ Step 2: Verify OTP and update email in DB.
     */
    public Map<String, String> verifyAndChangeEmail(AdminEmailOtpVerifyRequest request) {
        Admin admin = adminRepository.findByEmail(request.getCurrentEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + request.getCurrentEmail()));

        boolean isValid = otpStorageService.verifyOtp(request.getNewEmail(), request.getOtp());
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP.");
        }

        if (adminRepository.existsByEmail(request.getNewEmail())) {
            throw new RuntimeException("New email is already registered.");
        }

        admin.setEmail(request.getNewEmail());
        adminRepository.save(admin);

        log.info("✉️ Admin email changed from {} to {}", request.getCurrentEmail(), request.getNewEmail());

        Map<String, String> response = new HashMap<>();
        response.put("name", admin.getName());
        response.put("email", admin.getEmail());
        if (admin.getProfileImageUrl() != null) {
            response.put("profileImageUrl", baseUrl + admin.getProfileImageUrl());
        }

        return response;
    }

    /**
     * 📁 Save uploaded profile image and return relative path
     */
    private String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path uploadPath = Path.of(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("📁 Created upload directory: {}", uploadPath.toAbsolutePath());
        }

        String originalName = file.getOriginalFilename();
        String sanitizedFileName = (originalName != null)
                ? originalName.replaceAll("[^a-zA-Z0-9._-]", "_")
                : "profile.png";

        String uniqueFileName = UUID.randomUUID() + "_" + sanitizedFileName;
        File destination = uploadPath.resolve(uniqueFileName).toFile();

        file.transferTo(destination);

        return "/uploads/profile/" + uniqueFileName;
    }
}
