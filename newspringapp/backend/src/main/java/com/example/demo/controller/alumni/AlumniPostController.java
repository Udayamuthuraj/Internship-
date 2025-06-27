package com.example.demo.controller.alumni;

import com.example.demo.model.alumni.AlumniPost;
import com.example.demo.repository.alumni.AlumniPostRepository;
import com.example.demo.service.alumni.AlumniPostService;
import com.example.demo.service.alumni.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Collections; // Import Collections for Map.of
import java.util.List;
import java.util.Map; // Import Map

@RestController
@RequestMapping("/api/users/{userId}/posts") // Base mapping for user-specific posts
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend origin
public class AlumniPostController {

    @Autowired
    private AlumniPostService postService;

    @Autowired
    private AlumniPostRepository alumniPostRepository; // Direct repository usage for save

    @Autowired
    private FileStorageService fileStorageService;


    @GetMapping
    public ResponseEntity<List<AlumniPost>> getPosts(@PathVariable Long userId) {
        List<AlumniPost> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }
    @PostMapping("/post") 
    public ResponseEntity<?> createPost(
            @PathVariable Long userId, 
            @ModelAttribute AlumniPost post, 
            @RequestParam(value = "postImage", required = false) MultipartFile postImage 
    ) {
        post.setUserId(userId);
        if (postImage != null && !postImage.isEmpty()) {
            try {
                String photoUrl = fileStorageService.save(postImage, "posts");
                post.setPostPhotoUrl(photoUrl);
            } catch (Exception e) {
                System.err.println("Error uploading post image: " + e.getMessage());
                Map<String, String> errorResponse = Collections.singletonMap("message", "Failed to upload image: " + e.getMessage());
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } else {
            post.setPostPhotoUrl(null); 
        }
        post.setCreatedAt(LocalDateTime.now());
        alumniPostRepository.save(post);
        Map<String, String> successResponse = Collections.singletonMap("message", "Post created successfully!");
        return ResponseEntity.ok(successResponse);
    }
}
