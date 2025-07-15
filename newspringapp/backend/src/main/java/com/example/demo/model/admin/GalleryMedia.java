package com.example.demo.model.admin;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "filename", nullable = false, length = 255)
    private String filename;

    @NotBlank
    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @NotBlank
    @JsonIgnore
    @Column(name = "filepath", nullable = false)
    private String filepath;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "size")
    private Long size;

    @Column(name = "title", length = 255)
    private String title;  // ✅ New field

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy;

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
