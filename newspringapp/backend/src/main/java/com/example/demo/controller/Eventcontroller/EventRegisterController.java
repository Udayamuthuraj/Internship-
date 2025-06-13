package com.example.demo.controller.Eventcontroller;

import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.service.Eventservice.EventRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EventRegisterController {

    @Autowired
    private EventRegisterService service;

    private final String UPLOAD_DIR = "uploads/payment-screenshots/";

    @PostMapping("/register-event")
    public ResponseEntity<String> registerEvent(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) String regNo,
            @RequestParam String department,
            @RequestParam String course,
            @RequestParam String batch,
            @RequestParam String eventTitle,
            @RequestParam String role,
            @RequestParam MultipartFile paymentScreenshot
    ) {
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + paymentScreenshot.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.copy(paymentScreenshot.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            EventRegister register = new EventRegister();
            register.setName(name);
            register.setEmail(email);
            register.setRegNo(regNo);
            register.setDepartment(department);
            register.setCourse(course);
            register.setBatch(batch);
            register.setEventTitle(eventTitle);
            register.setRole(role);
            register.setPaymentScreenshotPath(filename);

            service.save(register);
            return ResponseEntity.ok("Registration successful");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during registration: " + e.getMessage());
        }
    }

    @GetMapping("/qr/{filename:.+}")
    public ResponseEntity<Resource> getQrCode(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
