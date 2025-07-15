package com.example.demo.controller.eventcontroller;

import com.example.demo.model.eventmodel.EventRegister;
import com.example.demo.service.eventservice.EventViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/view-registrations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EventViewController {

    private static final String IMAGE_DIR = "uploads/payment-screenshots/";

    private final EventViewService service;

    // ✅ Get latest event registrations with counts
    @GetMapping("/latest")
    public ResponseEntity<Map<String, Object>> getLatestEventRegistrations() {
        List<EventRegister> registrations = service.getLatestEventRegistrations();

        Map<String, Object> response = new HashMap<>();
        if (!registrations.isEmpty()) {
            String latestTitle = registrations.get(0).getEventTitle();
            long studentCount = registrations.stream()
                    .filter(r -> "Student".equalsIgnoreCase(r.getRole()))
                    .count();
            long alumniCount = registrations.stream()
                    .filter(r -> "Alumni".equalsIgnoreCase(r.getRole()))
                    .count();

            response.put("eventTitle", latestTitle);
            response.put("registrations", registrations);
            response.put("studentCount", studentCount);
            response.put("alumniCount", alumniCount);
        } else {
            response.put("eventTitle", "No Event");
            response.put("registrations", Collections.emptyList());
            response.put("studentCount", 0);
            response.put("alumniCount", 0);
        }

        return ResponseEntity.ok(response);
    }

    // ✅ Get individual registration by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventRegister> getById(@PathVariable Long id) {
        EventRegister view = service.getById(id);
        return view != null ? ResponseEntity.ok(view) : ResponseEntity.notFound().build();
    }

    // ✅ Serve uploaded screenshot by filename (with dynamic content type)
    @GetMapping("/screenshot/{filename:.+}")
    public ResponseEntity<Resource> getPaymentScreenshot(@PathVariable String filename) {
        try {
            Path path = Paths.get(IMAGE_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // 🧠 Detect content type dynamically
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
