package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String message;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;

    // ✅ Admin reply message (optional)
    @Column(columnDefinition = "TEXT")
    private String adminReply;

    // ✅ Flag to mark if admin has replied
    private boolean isReplied = false;
}
