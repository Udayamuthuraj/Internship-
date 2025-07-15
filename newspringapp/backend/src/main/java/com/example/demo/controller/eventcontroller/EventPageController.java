package com.example.demo.controller.eventcontroller;

import com.example.demo.model.eventmodel.EventModel;
import com.example.demo.service.eventservice.EventPageService;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000") // 🔁 Adjust for production
public class EventPageController {

    private final EventPageService eventService;
    private final String uploadDir = "uploads";

    @Autowired
    public EventPageController(EventPageService eventService) {
        this.eventService = eventService;
    }

    // ✅ Get all events
    @GetMapping
    public ResponseEntity<List<EventModel>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // ✅ Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventModel> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get event by title
    @GetMapping("/title/{title}")
    public ResponseEntity<EventModel> getEventByTitle(@PathVariable String title) {
        return eventService.getEventByTitle(title)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Serve poster
    @GetMapping("/poster/{filename:.+}")
    public ResponseEntity<Resource> getPoster(@PathVariable String filename) {
        return serveFile(filename);
    }

    // ✅ Serve recap media (image or video)
    @GetMapping("/recap/{filename:.+}")
    public ResponseEntity<Resource> getRecapMedia(@PathVariable String filename) {
        return serveFile(filename);
    }

    // ✅ Serve PDF
    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        return serveFile(filename);
    }

    // ✅ Serve QR code
    @GetMapping("/qr/{filename:.+}")
    public ResponseEntity<Resource> getQRCode(@PathVariable String filename) {
        return serveFile(filename);
    }

    // 🔁 Universal File Serving Method (Auto-detect media type)
    private ResponseEntity<Resource> serveFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // 🧠 Detect file type (image, pdf, video, etc.)
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream"; // fallback
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
