package com.example.demo.service.admin;

import com.example.demo.dto.admin.VideoDTO;
import com.example.demo.model.admin.Video;
import com.example.demo.repository.admin.VideoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;

    @Value("${media.video.upload-dir}")
    private String uploadDir;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("❌ Could not create upload directory!", e);
        }
    }

    // ✅ Save a new video
    public VideoDTO saveVideo(MultipartFile file, String title, String uploadedBy, String category, String description) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("File name is invalid.");
        }

        String safeName = originalFilename.replaceAll("\\s+", "_");
        String uniqueFilename = UUID.randomUUID() + "_" + safeName;
        Path destinationPath = Paths.get(uploadDir).resolve(uniqueFilename).normalize();

        Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

        String contentType = file.getContentType();
        if (contentType == null || contentType.trim().isEmpty()) {
            contentType = Files.probeContentType(destinationPath);
            if (contentType == null) contentType = "application/octet-stream";
        }

        String fileUrl = baseUrl + "/api/admin/videos/media/" + uniqueFilename;

        Video video = Video.builder()
                .title(title)
                .filename(uniqueFilename)
                .fileUrl(fileUrl)
                .filepath(destinationPath.toString())
                .contentType(contentType)
                .size(file.getSize())
                .uploadDate(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .uploadedBy(uploadedBy)
                .category(category)
                .description(description)
                .build();

        return mapToDTO(videoRepository.save(video));
    }

    // ✅ Update metadata
    public VideoDTO updateVideoMetadata(Long id, String newTitle, String newCategory, String newDescription) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with ID: " + id));

        if (newTitle != null) video.setTitle(newTitle);
        if (newCategory != null) video.setCategory(newCategory);
        if (newDescription != null) video.setDescription(newDescription);

        video.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(videoRepository.save(video));
    }

    // ✅ Get all
    public List<VideoDTO> getAllVideos() {
        return videoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Get paginated
    public Page<VideoDTO> getVideoPage(Pageable pageable) {
        return videoRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    // ✅ By category
    public List<VideoDTO> getVideosByCategory(String category) {
        return videoRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Search by filename
    public List<VideoDTO> searchByFilename(String keyword) {
        return videoRepository.findByFilenameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Search by title
    public List<VideoDTO> searchByTitle(String keyword) {
        return videoRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Get by ID
    public Optional<VideoDTO> getVideoById(Long id) {
        return videoRepository.findById(id)
                .map(this::mapToDTO);
    }

    // ✅ Delete
    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with ID: " + id));

        try {
            Path filePath = Paths.get(video.getFilepath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete video from disk.", e);
        }

        videoRepository.deleteById(id);
    }

    // ✅ Resource serving
    public Resource loadVideoAsResource(String filename) {
        try {
            Path file = getVideoPath(filename);
            if (Files.exists(file)) {
                return new PathResource(file);
            } else {
                throw new RuntimeException("File not found: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error loading file: " + filename, e);
        }
    }

    // ✅ Get full path
    public Path getVideoPath(String filename) {
        return Paths.get(uploadDir).resolve(filename).normalize();
    }

    // ✅ Utility mapper
    private VideoDTO mapToDTO(Video video) {
        return VideoDTO.builder()
                .id(video.getId())
                .filename(video.getFilename())
                .fileUrl(video.getFileUrl())
                .contentType(video.getContentType())
                .size(video.getSize())
                .title(video.getTitle())
                .description(video.getDescription())
                .category(video.getCategory())
                .uploadedBy(video.getUploadedBy())
                .uploadDate(video.getUploadDate())
                .updatedAt(video.getUpdatedAt())
                .build();
    }
}
