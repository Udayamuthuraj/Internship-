package com.example.demo.controller.Eventcontroller;

import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.repository.Eventrepository.EventRepository;
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
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EventRegisterController {

    private final String UPLOAD_DIR = "uploads/payment-screenshots/";

    @Autowired
    private EventRegisterService registerService;

    @Autowired
    private EventRepository eventRepository; // ✅ Using your EventRepository

    // ✅ Register endpoint
    @PostMapping("/register-event")
    public ResponseEntity<String> registerEvent(
            @RequestParam String name,
            @RequestParam String batch,
            @RequestParam String role,
            @RequestParam String course,
            @RequestParam String eventTitle,
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
            register.setBatch(batch);
            register.setRole(role);
            register.setCourse(course);
            register.setEventTitle(eventTitle);
            register.setPaymentScreenshotPath(filename);

            registerService.save(register);
            return ResponseEntity.ok("Registration successful");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during registration: " + e.getMessage());
        }
    }

    // ✅ Serve payment screenshot if needed
    @GetMapping("/payment-screenshot/{filename:.+}")
    public ResponseEntity<Resource> getScreenshot(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
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

    // ✅ Return upcoming event titles for the register page
    @GetMapping("/events/upcoming-titles")
    public ResponseEntity<List<String>> getUpcomingEventTitles() {
        LocalDate today = LocalDate.now();
        List<String> titles = eventRepository.findUpcomingEventTitles(today);
        return ResponseEntity.ok(titles);
    }
}
