package com.example.demo.model.student;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "stu_details")
public class StudentDetails {

    @Id
    private Long id;
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    private String headline;

    @Column(length = 2000)
    private String about;

    @Column(length = 2000)
    private String education;

    @Column(length = 1000)
    private String skills;
    
    @Column( length = 500)
    private String linkedinGithub;

    @Column(name = "resume_url", length = 1500)
    private String resumeUrl;

    @Column(name = "profile_picture_path", length = 1500)
    private String profilePicturePath;

    public StudentDetails() {}

    public StudentDetails(Student student, String headline, String about, String education, String skills,
                          String linkedinGithub, String resumeUrl,String profilePicturePath) {
        this.student = student;
        this.headline = headline;
        this.about = about;
        this.education = education;
        this.skills = skills;
        this.linkedinGithub = linkedinGithub;
        this.resumeUrl = resumeUrl;
        this.profilePicturePath = profilePicturePath;
    }

    // Getters & Setters for all fields (include all)

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }

    public void setStudent(Student student) {
    this.student = student;
    if (student != null && student.getStudentDetails() != this) {
        student.setStudentDetails(this); // sync both sides
    }
}
    public String getHeadline() { return headline; }

    public void setHeadline(String headline) { this.headline = headline; }

    public String getAbout() { return about; }

    public void setAbout(String about) { this.about = about; }

    public String getEducation() { return education; }

    public void setEducation(String education) { this.education = education; }

    public String getSkills() { return skills; }

    public void setSkills(String skills) { this.skills = skills; }

    public String getLinkedinGithub() { return linkedinGithub; }

    public void setLinkedinGithub(String linkedinGithub) { this.linkedinGithub = linkedinGithub; }

    public String getResumeUrl() { return resumeUrl; }

    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getProfilePicturePath() { return profilePicturePath; }

    public void setProfilePicturePath(String profilePicturePath) { this.profilePicturePath = profilePicturePath; }
}
