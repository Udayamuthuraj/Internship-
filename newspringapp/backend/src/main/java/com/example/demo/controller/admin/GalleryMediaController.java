package com.example.demo.controller.admin;

import com.example.demo.dto.admin.GalleryMediaDTO;
import com.example.demo.service.admin.GalleryMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/gallery")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class GalleryMediaController {

    private final GalleryMediaService galleryMediaService;
    private static final String DEFAULT_UPLOADER = "Admin";

    // ✅ Upload new media
    @PostMapping("/upload")
    public ResponseEntity<?> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "uploadedBy", defaultValue = DEFAULT_UPLOADER) String uploadedBy,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "description", required = false) String description
    ) {
        try {
            GalleryMediaDTO saved = galleryMediaService.saveMedia(file, uploadedBy, category, description, title);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed", "details", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid input", "details", e.getMessage()));
        }
    }

    // ✅ Update media metadata
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMedia(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "description", required = false) String description
    ) {
        try {
            GalleryMediaDTO updated = galleryMediaService.updateMediaMetadata(id, title, category, description);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Media not found", "details", e.getMessage()));
        }
    }

    // ✅ Get all media
    @GetMapping("/all")
    public ResponseEntity<List<GalleryMediaDTO>> getAllMedia() {
        return ResponseEntity.ok(galleryMediaService.getAllMedia());
    }

    // ✅ Get media by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<GalleryMediaDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(galleryMediaService.getMediaByCategory(category));
    }

    // ✅ Search by filename
    @GetMapping("/search")
    public ResponseEntity<List<GalleryMediaDTO>> searchByFilename(@RequestParam String keyword) {
        return ResponseEntity.ok(galleryMediaService.searchByFilename(keyword));
    }

    // ✅ Search by title
    @GetMapping("/search/title")
    public ResponseEntity<List<GalleryMediaDTO>> searchByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(galleryMediaService.searchByTitle(keyword));
    }

    // ✅ View or preview media file
    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<?> viewMedia(@PathVariable String filename) {
        try {
            Path mediaPath = galleryMediaService.getMediaPath(filename);
            Resource resource = new UrlResource(mediaPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Media not found", "filename", filename));
            }

            MediaType mediaType = MediaTypeFactory.getMediaType(resource)
                    .orElse(MediaType.APPLICATION_OCTET_STREAM);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error reading file", "details", e.getMessage()));
        }
    }

    // ✅ Delete media by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteMedia(@PathVariable Long id) {
        try {
            galleryMediaService.deleteMedia(id);
            return ResponseEntity.ok(Map.of("message", "Media permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Media not found", "details", e.getMessage()));
        }
    }

    // 🔁 Optional: Paginated endpoint
    // @GetMapping("/all/paged")
    // public ResponseEntity<Page<GalleryMediaDTO>> getAllPaged(Pageable pageable) {
    //     return ResponseEntity.ok(galleryMediaService.getMediaPage(pageable));
    // }
}
