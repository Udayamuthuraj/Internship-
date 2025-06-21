package com.example.demo.controller.student;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.student.Student;
import com.example.demo.model.student.StudentDetails;
import com.example.demo.service.student.StudentDetailsService;
import com.example.demo.service.student.StudentService;

@RestController
@RequestMapping("/api/student/details")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentDetailsController {

    @Autowired
    private StudentDetailsService studentDetailsService;

    @Autowired
    private StudentService studentService;

    // ✅ Extract email from JWT token
    private String getLoggedInEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // Set by JwtFilter
    }

    @GetMapping("")
    public ResponseEntity<?> getStudentDetails() {
        try {
            String email = getLoggedInEmail();

            Optional<Student> optionalStudent = studentService.getStudentByEmail(email);
            if (optionalStudent.isEmpty()) {
                return ResponseEntity.status(404).body("Student not found");
            }

            Student student = optionalStudent.get();
            Optional<StudentDetails> optionalDetails = studentDetailsService.getDetailsByStudentId(student.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("name", student.getName());
            response.put("email", student.getEmail());
            response.put("department", student.getDepartment());
            response.put("batch", student.getBatch());

            StudentDetails details = optionalDetails.orElse(new StudentDetails());
            response.put("headline", details.getHeadline());
            response.put("about", details.getAbout());
            response.put("education", details.getEducation());
            response.put("skills", details.getSkills());
            response.put("linkedinGithub", details.getLinkedinGithub());
            response.put("resumeUrl", details.getResumeUrl());
            response.put("profilePicUrl", details.getProfilePicturePath());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch student details");
        }
    }

    @PutMapping("")
    public ResponseEntity<?> updateStudentDetails(@RequestBody StudentDetails updatedDetails) {
        try {
            String email = getLoggedInEmail();

            Optional<Student> optionalStudent = studentService.getStudentByEmail(email);
            if (optionalStudent.isEmpty()) {
                return ResponseEntity.status(404).body("Student not found");
            }

            Student student = optionalStudent.get();
            StudentDetails savedDetails = studentDetailsService.updateStudentDetails(student.getId(), updatedDetails);
            return ResponseEntity.ok(savedDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update student details");
        }
    }

    @PutMapping("/profile-picture")
    public ResponseEntity<Map<String, String>> updateProfilePicture(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = getLoggedInEmail();
            Optional<Student> optionalStudent = studentService.getStudentByEmail(email);
            if (optionalStudent.isEmpty()) {
                response.put("error", "Student not found");
                return ResponseEntity.status(404).body(response);
            }

            Student student = optionalStudent.get();

            String fileName = student.getId() + "_profile.jpg";
            String uploadDir = "uploads/profile-pictures";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String profilePicPath = "/uploads/profile-pictures/" + fileName;
            studentDetailsService.updateProfilePicture(student.getId(), profilePicPath);

            response.put("message", "Profile picture updated");
            response.put("profilePicUrl", profilePicPath);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to update profile picture");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/resume")
public ResponseEntity<Map<String, String>> updateResume(@RequestParam("file") MultipartFile file) {
    Map<String, String> response = new HashMap<>();
    try {
        String email = getLoggedInEmail();
        Optional<Student> optionalStudent = studentService.getStudentByEmail(email);
        if (optionalStudent.isEmpty()) {
            response.put("error", "Student not found");
            return ResponseEntity.status(404).body(response);
        }

        Student student = optionalStudent.get();
        String fileName = student.getId() + "_resume.pdf";
        String uploadDir = "uploads/resumes";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String resumePath = "/uploads/resumes/" + fileName;
        studentDetailsService.updateResumeUrl(student.getId(), resumePath);

        response.put("message", "Resume uploaded");
        response.put("resumeUrl", resumePath); // ✅ Return new resume URL
        return ResponseEntity.ok(response);
    } catch (IOException e) {
        response.put("error", "Failed to update resume");
        return ResponseEntity.status(500).body(response);
    }
}


    @GetMapping("/profile-picture/{filename:.+}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get("uploads/profile-pictures").resolve(filename).normalize();
        UrlResource urlResource = new UrlResource(filePath.toUri());

        if (urlResource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(urlResource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/resume/{filename:.+}")
    public ResponseEntity<Resource> getResume(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get("uploads/resumes").resolve(filename).normalize();
        UrlResource urlResource = new UrlResource(filePath.toUri());

        if (urlResource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(urlResource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
