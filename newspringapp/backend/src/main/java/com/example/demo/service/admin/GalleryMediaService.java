package com.example.demo.service.admin;

import com.example.demo.dto.admin.GalleryMediaDTO;
import com.example.demo.model.admin.GalleryMedia;
import com.example.demo.repository.admin.GalleryMediaRepository;
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
public class GalleryMediaService {

    private final GalleryMediaRepository galleryMediaRepository;

    @Value("${media.gallery.upload-dir}")
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

    /**
     * Upload and save a new media file with title.
     */
    public GalleryMediaDTO saveMedia(MultipartFile file, String uploadedBy, String category, String description, String title) throws IOException {
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

        try {
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IOException("Failed to save file to disk.", e);
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.trim().isEmpty()) {
            contentType = Files.probeContentType(destinationPath);
            if (contentType == null) contentType = "application/octet-stream";
        }

        String fileUrl = baseUrl + "/api/admin/gallery/media/" + uniqueFilename;

        GalleryMedia media = GalleryMedia.builder()
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

        return toDTO(galleryMediaRepository.save(media));
    }

    public GalleryMediaDTO updateMediaMetadata(Long id, String newTitle, String newCategory, String newDescription) {
        GalleryMedia media = galleryMediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + id));

        if (newTitle != null) media.setTitle(newTitle);
        if (newCategory != null) media.setCategory(newCategory);
        if (newDescription != null) media.setDescription(newDescription);

        media.setUpdatedAt(LocalDateTime.now());
        return toDTO(galleryMediaRepository.save(media));
    }

    public List<GalleryMediaDTO> getAllMedia() {
        return galleryMediaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<GalleryMediaDTO> getMediaById(Long id) {
        return galleryMediaRepository.findById(id).map(this::toDTO);
    }

    public Page<GalleryMediaDTO> getMediaPage(Pageable pageable) {
        return galleryMediaRepository.findAll(pageable).map(this::toDTO);
    }

    public List<GalleryMediaDTO> searchByFilename(String keyword) {
        return galleryMediaRepository.findByFilenameContainingIgnoreCase(keyword)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<GalleryMediaDTO> searchByTitle(String keyword) {
        return galleryMediaRepository.findByTitleContainingIgnoreCase(keyword)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<GalleryMediaDTO> getMediaByCategory(String category) {
        return galleryMediaRepository.findByCategory(category)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void deleteMedia(Long id) {
        GalleryMedia media = galleryMediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + id));

        try {
            Path filePath = Paths.get(media.getFilepath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from disk.", e);
        }

        galleryMediaRepository.deleteById(id);
    }

    public Path getMediaPath(String filename) {
        return Paths.get(uploadDir).resolve(filename).normalize();
    }

    public Resource loadMediaAsResource(String filename) {
        try {
            Path file = getMediaPath(filename);
            if (Files.exists(file)) {
                return new PathResource(file);
            } else {
                throw new RuntimeException("File not found: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error loading file: " + filename, e);
        }
    }

    // ==============================
    // ✅ Convert Entity to DTO
    // ==============================
    private GalleryMediaDTO toDTO(GalleryMedia media) {
        GalleryMediaDTO dto = new GalleryMediaDTO();
        dto.setId(media.getId());
        dto.setFilename(media.getFilename());
        dto.setFileUrl(media.getFileUrl());
        dto.setContentType(media.getContentType());
        dto.setSize(media.getSize());
        dto.setTitle(media.getTitle());
        dto.setDescription(media.getDescription());
        dto.setCategory(media.getCategory());
        dto.setUploadedBy(media.getUploadedBy());
        dto.setUploadDate(media.getUploadDate());
        dto.setUpdatedAt(media.getUpdatedAt());
        return dto;
    }
}
