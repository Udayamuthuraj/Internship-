package com.example.demo.model.eventmodel;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_register")
public class EventRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String batch;
    private String role;
    private String course;

    @Column(name = "event_title")
    private String eventTitle;

    @Column(name = "payment_screenshot_path")
    private String paymentScreenshotPath;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    // ✅ Auto-set createdDate when the record is inserted
    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getPaymentScreenshotPath() { return paymentScreenshotPath; }
    public void setPaymentScreenshotPath(String paymentScreenshotPath) {
        this.paymentScreenshotPath = paymentScreenshotPath;
    }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
