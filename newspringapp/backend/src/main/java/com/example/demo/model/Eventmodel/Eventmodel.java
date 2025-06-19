package com.example.demo.model.Eventmodel;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Eventmodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private LocalDate date;  // ✅ Correct data type
    private String time;
    private String location;
    private String organizer;

    @Column(length = 1000)
    private String description;

    private String posterPath;
    private String recapMediaPath;
    private String pdfPath;
    private String qrCodePath;

    // 🧱 Constructors
    public Eventmodel() {}

    public Eventmodel(Long id, String title, LocalDate date, String time, String location,
                      String organizer, String description, String posterPath,
                      String recapMediaPath, String pdfPath, String qrCodePath) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.time = time;
        this.location = location;
        this.organizer = organizer;
        this.description = description;
        this.posterPath = posterPath;
        this.recapMediaPath = recapMediaPath;
        this.pdfPath = pdfPath;
        this.qrCodePath = qrCodePath;
    }

    // 🧩 Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public String getRecapMediaPath() {
        return recapMediaPath;
    }

    public void setRecapMediaPath(String recapMediaPath) {
        this.recapMediaPath = recapMediaPath;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public String getQrCodePath() {
        return qrCodePath;
    }

    public void setQrCodePath(String qrCodePath) {
        this.qrCodePath = qrCodePath;
    }
}
