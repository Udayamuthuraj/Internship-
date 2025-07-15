package com.example.demo.controller.admin;

import com.example.demo.dto.admin.VideoDTO;
import com.example.demo.service.admin.VideoService;
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
@RequestMapping("/api/admin/videos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class VideoController {

    private final VideoService videoService;

    private static final String DEFAULT_UPLOADER = "Admin";

    // ✅ Upload new video
    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "uploadedBy", defaultValue = DEFAULT_UPLOADER) String uploadedBy,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "description", required = false) String description
    ) {
        try {
            VideoDTO saved = videoService.saveVideo(file, title, uploadedBy, category, description);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed", "details", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid input", "details", e.getMessage()));
        }
    }

    // ✅ Update video metadata (title, category, description)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVideoMetadata(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "description", required = false) String description
    ) {
        try {
            VideoDTO updated = videoService.updateVideoMetadata(id, title, category, description);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Video not found", "details", e.getMessage()));
        }
    }

    // ✅ Get all videos
    @GetMapping("/all")
    public ResponseEntity<List<VideoDTO>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    // ✅ Get videos by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<VideoDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(videoService.getVideosByCategory(category));
    }

    // ✅ Search by filename
    @GetMapping("/search")
    public ResponseEntity<List<VideoDTO>> searchByFilename(@RequestParam String keyword) {
        return ResponseEntity.ok(videoService.searchByFilename(keyword));
    }

    // ✅ Search by title
    @GetMapping("/search/title")
    public ResponseEntity<List<VideoDTO>> searchByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(videoService.searchByTitle(keyword));
    }

    // ✅ Delete video by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok(Map.of("message", "Video permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Video not found", "details", e.getMessage()));
        }
    }

    // ✅ View/Stream video file
    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<?> viewVideo(@PathVariable String filename) {
        try {
            Path videoPath = videoService.getVideoPath(filename);
            Resource resource = new UrlResource(videoPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Video not found", "filename", filename));
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

    // 🔁 Optional: Paginated list
    // @GetMapping("/all/paged")
    // public ResponseEntity<Page<VideoDTO>> getAllPaged(Pageable pageable) {
    //     return ResponseEntity.ok(videoService.getVideoPage(pageable));
    // }
}
