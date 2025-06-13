package com.example.demo.controller.Eventcontroller;

import com.example.demo.model.Eventmodel.Eventmodel;
import com.example.demo.service.Eventservice.Eventpageservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class Eventpagecontroller {

    @Autowired
    private Eventpageservice eventService;

    @GetMapping
    public List<Eventmodel> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Optional<Eventmodel> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<Eventmodel> getEventByTitle(@PathVariable String title) {
        return eventService.getEventByTitle(title)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ This is the endpoint for serving poster image
    @GetMapping("/poster/{filename:.+}")
    public ResponseEntity<Resource> getPoster(@PathVariable String filename) {
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
    @GetMapping("/qr/{filename:.+}")
public ResponseEntity<Resource> getQRCode(@PathVariable String filename) {
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
