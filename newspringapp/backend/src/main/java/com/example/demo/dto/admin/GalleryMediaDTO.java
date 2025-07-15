package com.example.demo.dto.admin;

import java.time.LocalDateTime;

public class GalleryMediaDTO {

    private Long id;
    private String filename;
    private String fileUrl;
    private String contentType;
    private Long size;
    private String title;
    private String description;
    private String category;
    private String uploadedBy;
    private LocalDateTime uploadDate;
    private LocalDateTime updatedAt;

    // ===========================
    // Constructors
    // ===========================
    public GalleryMediaDTO() {
    }

    public GalleryMediaDTO(Long id, String filename, String fileUrl, String contentType, Long size,
                           String title, String description, String category,
                           String uploadedBy, LocalDateTime uploadDate, LocalDateTime updatedAt) {
        this.id = id;
        this.filename = filename;
        this.fileUrl = fileUrl;
        this.contentType = contentType;
        this.size = size;
        this.title = title;
        this.description = description;
        this.category = category;
        this.uploadedBy = uploadedBy;
        this.uploadDate = uploadDate;
        this.updatedAt = updatedAt;
    }

    // ===========================
    // Getters and Setters
    // ===========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
