package com.example.demo.model.admin;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "filename", nullable = false, length = 255)
    private String filename;

    @NotBlank
    @Column(name = "file_url", nullable = false)
    private String fileUrl; // Public URL for video streaming or download

    @NotBlank
    @JsonIgnore
    @Column(name = "filepath", nullable = false)
    private String filepath; // Local server path for backend access only

    @Column(name = "content_type", length = 100)
    private String contentType; // e.g., video/mp4

    @Column(name = "size")
    private Long size; // Size in bytes

    @Column(name = "title", length = 255)
    private String title; // Optional title for the video

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category", length = 100)
    private String category; // e.g., Event, Interview, Workshop

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy; // Admin uploader name or email

    @Column(name = "upload_date", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime uploadDate;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.uploadDate == null) {
            this.uploadDate = LocalDateTime.now();
        }
    }
}
