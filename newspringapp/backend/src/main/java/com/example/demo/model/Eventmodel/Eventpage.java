package com.example.demo.model.Eventmodel;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Eventpage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String date;
    private String time;
    private String location;
    private String organizer;

    @Column(length = 1000)
    private String description;

    private String posterPath;
    private String recapMediaPath;
    private String pdfPath;
    private String qrCodePath;

    // Constructors
    public Eventpage() {}

    public Eventpage(String title, String date, String time, String location, String organizer,
                      String description, String posterPath, String recapMediaPath, String pdfPath, String qrCodePath) {
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

    // Getters and Setters

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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
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