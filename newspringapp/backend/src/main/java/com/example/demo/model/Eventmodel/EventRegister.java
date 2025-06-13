package com.example.demo.model.Eventmodel;

import jakarta.persistence.*;

@Entity
@Table(name = "event_registration")
public class EventRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String regNo;
    private String department;
    private String course;
    private String batch;
    private String eventTitle;
    private String role;

    private String paymentScreenshotPath;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRegNo() { return regNo; }
    public void setRegNo(String regNo) { this.regNo = regNo; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPaymentScreenshotPath() { return paymentScreenshotPath; }
    public void setPaymentScreenshotPath(String paymentScreenshotPath) { this.paymentScreenshotPath = paymentScreenshotPath; }
}
