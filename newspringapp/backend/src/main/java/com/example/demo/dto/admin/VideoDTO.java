package com.example.demo.dto.admin;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoDTO {

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
}
