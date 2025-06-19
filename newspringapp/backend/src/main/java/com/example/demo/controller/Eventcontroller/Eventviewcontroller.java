package com.example.demo.controller.Eventcontroller;

import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.service.Eventservice.EventViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/view-registrations")
@CrossOrigin(origins = "http://localhost:3000")
public class EventViewController {

    private final String IMAGE_DIR = "uploads/payment-screenshots/";

    @Autowired
    private EventViewService service;

    @GetMapping("/latest")
    public Map<String, Object> getLatestEventRegistrations() {
        List<EventRegister> registrations = service.getLatestEventRegistrations();

        String latestTitle = registrations.isEmpty() ? "No Event" : registrations.get(0).getEventTitle();

        Map<String, Object> response = new HashMap<>();
        response.put("eventTitle", latestTitle);
        response.put("eventDate", ""); // Optional if you're not storing event date
        response.put("registrations", registrations);
        response.put("studentCount", registrations.stream().filter(r -> r.getRole().equalsIgnoreCase("Student")).count());
        response.put("alumniCount", registrations.stream().filter(r -> r.getRole().equalsIgnoreCase("Alumni")).count());

        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRegister> getById(@PathVariable Long id) {
        EventRegister view = service.getById(id);
        return view != null ? ResponseEntity.ok(view) : ResponseEntity.notFound().build();
    }

    @GetMapping("/screenshot/{filename:.+}")
    public ResponseEntity<Resource> getPaymentScreenshot(@PathVariable String filename) {
        try {
            Path path = Paths.get(IMAGE_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(path.toUri());

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
