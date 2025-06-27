package com.example.demo.model.alumni;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uid;

    private String uname;
    private String udepartment;

    @Column(nullable = true)
    private String ubatch;

    private String uemail;
    private String upassword;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "current_job")
    private String currentJob;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "num_of_projects")
    private Integer numOfProjects;

    @Column(name = "num_of_awards")
    private Integer numOfAwards;

    @Column(name = "contact_number")
    private String contactNumber;

    private String summary;
    private String specializations;

    @Column(name = "facebook_url")
    private String facebookUrl;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;
}
