package com.example.demo.model.alumni;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "post_text")
    private String postText;

    @Column(name = "post_photo_url")
    private String postPhotoUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
