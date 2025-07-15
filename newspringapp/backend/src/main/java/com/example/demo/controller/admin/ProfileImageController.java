package com.example.demo.controller.admin;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads/profile")
@CrossOrigin(origins = "http://localhost:3000") // if you're using React frontend on port 3000
public class ProfileImageController {

    private final String uploadDir = "D:/alumni portal/newspringapp/uploads/profile";

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // or detect dynamically if needed
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
