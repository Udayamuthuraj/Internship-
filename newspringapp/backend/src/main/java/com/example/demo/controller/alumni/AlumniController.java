package com.example.demo.controller.alumni;

import com.example.demo.dto.alumni.AlumniRegisterDTO;
import com.example.demo.dto.alumni.LoginRequest;
import com.example.demo.dto.alumni.LoginResponse;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import com.example.demo.service.alumni.AlumniService;
import com.example.demo.service.alumni.FileStorageService;
import com.example.demo.util.security.alumni.JwtUtil;
import org.springframework.beans.BeanUtils; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FileStorageService fileStorageService;


    @PostMapping("/register")
    public String registerAlumni(@RequestBody AlumniRegisterDTO dto) {
        return alumniService.registerAlumni(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginAlumni(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login Attempt => username: " + loginRequest.getUsername() + ", password: " + loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        // If authentication is successful, retrieve the Alumni entity
        Alumni alumni = alumniRepository.findByUemail(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after successful authentication. This should not happen.")); // Should not be reached if authenticate succeeds

        // Generate JWT token
        String token = jwtUtil.generateToken(alumni.getUemail());

        // Return login response including token, user ID, and username
        return ResponseEntity.ok(new LoginResponse(token, alumni.getUid(), alumni.getUname()));
    }


    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<Alumni> alumni = alumniService.getAlumniById(userId);
        return alumni.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @ModelAttribute Alumni updatedAlumniData, // Data from the form
            @RequestParam(value = "uploadedProfileImage", required = false) MultipartFile profilePhotoFile) {

        // 1. Fetch the existing alumni from the database
        Optional<Alumni> existingAlumniOptional = alumniService.getAlumniById(id);
        if (existingAlumniOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Or return a specific error message
        }
        Alumni existingAlumni = existingAlumniOptional.get();

        BeanUtils.copyProperties(updatedAlumniData, existingAlumni, "uid", "upassword", "profilePhotoUrl");

        // 3. Handle profile photo upload if a new file is provided
        if (profilePhotoFile != null && !profilePhotoFile.isEmpty()) {
            try {
                String uploadedUrl = fileStorageService.save(profilePhotoFile, "profiles");
                existingAlumni.setProfilePhotoUrl(uploadedUrl);
            } catch (Exception e) {
                // Log and return an error if file upload fails
                System.err.println("Error uploading profile image: " + e.getMessage());
                return ResponseEntity.badRequest().body("Failed to upload profile image: " + e.getMessage());
            }
        }

        alumniService.updateProfile(existingAlumni); // Pass the merged object

        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchAlumni(@RequestParam("uname") String uname) {
        return ResponseEntity.ok(alumniService.searchAlumniByUname(uname));
    }
    
}
