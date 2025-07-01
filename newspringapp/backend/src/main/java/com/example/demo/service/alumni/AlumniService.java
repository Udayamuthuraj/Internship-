package com.example.demo.service.alumni;

import com.example.demo.dto.alumni.AlumniRegisterDTO;
import com.example.demo.dto.alumni.LoginRequest;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.util.List;

@Service
public class AlumniService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AlumniRepository alumniRepository;

    public String registerAlumni(AlumniRegisterDTO dto) {
        if (alumniRepository.existsByUemail(dto.getUemail())) {
            return "Email is already registered.";
        }

        Alumni alumni = new Alumni();
        alumni.setUname(dto.getUname());
        alumni.setUdepartment(dto.getUdepartment());
        alumni.setUbatch(dto.getUbatch());
        alumni.setUemail(dto.getUemail());
        alumni.setUpassword(passwordEncoder.encode(dto.getUpassword())); // Hashed password

        alumni.setNumOfAwards(0);
        alumni.setNumOfProjects(0);
        alumni.setSummary("");
        alumni.setSpecializations("");
        alumni.setProfilePhotoUrl("");
        alumni.setLinkedinUrl("");
        alumni.setInstagramUrl("");
        alumni.setFacebookUrl("");
        alumni.setContactNumber("");
        alumni.setCurrentJob("");
        alumni.setYearsOfExperience(0);

        alumniRepository.save(alumni);
        return "Alumni Registration successful!";
    }

    public boolean loginAlumni(LoginRequest loginRequest) {
        Optional<Alumni> alumniOptional = alumniRepository.findByUemail(loginRequest.getUsername());
        if (alumniOptional.isEmpty()) {
            return false;
        }
        Alumni alumni = alumniOptional.get();
        return passwordEncoder.matches(loginRequest.getPassword(), alumni.getUpassword());
    }

    public Optional<Alumni> getAlumniById(Long id) {
        return alumniRepository.findById(id);
    }

    public Alumni registerAlumni(Alumni alumni) {
        if (alumni.getUpassword() != null && !alumni.getUpassword().isEmpty() && !alumni.getUpassword().startsWith("$2a$")) {
            alumni.setUpassword(passwordEncoder.encode(alumni.getUpassword()));
        }
        return alumniRepository.save(alumni);
    }

    public Alumni updateProfile(Alumni updatedAlumni) {
        Optional<Alumni> existingAlumniOptional = alumniRepository.findById(updatedAlumni.getUid());

        if (existingAlumniOptional.isEmpty()) {
            throw new RuntimeException("Alumni not found with ID: " + updatedAlumni.getUid());
        }

        Alumni existingAlumni = existingAlumniOptional.get();
        if (updatedAlumni.getUname() != null) existingAlumni.setUname(updatedAlumni.getUname());
        if (updatedAlumni.getUdepartment() != null) existingAlumni.setUdepartment(updatedAlumni.getUdepartment());
        if (updatedAlumni.getUbatch() != null) existingAlumni.setUbatch(updatedAlumni.getUbatch());
        if (updatedAlumni.getUemail() != null) existingAlumni.setUemail(updatedAlumni.getUemail());
        if (updatedAlumni.getContactNumber() != null) existingAlumni.setContactNumber(updatedAlumni.getContactNumber());
        if (updatedAlumni.getCurrentJob() != null) existingAlumni.setCurrentJob(updatedAlumni.getCurrentJob());
        existingAlumni.setYearsOfExperience(updatedAlumni.getYearsOfExperience());
        existingAlumni.setNumOfProjects(updatedAlumni.getNumOfProjects());
        existingAlumni.setNumOfAwards(updatedAlumni.getNumOfAwards());
        
        if (updatedAlumni.getSummary() != null) existingAlumni.setSummary(updatedAlumni.getSummary());
        if (updatedAlumni.getSpecializations() != null) existingAlumni.setSpecializations(updatedAlumni.getSpecializations());
        if (updatedAlumni.getProfilePhotoUrl() != null) existingAlumni.setProfilePhotoUrl(updatedAlumni.getProfilePhotoUrl()); 
        if (updatedAlumni.getFacebookUrl() != null) existingAlumni.setFacebookUrl(updatedAlumni.getFacebookUrl());
        if (updatedAlumni.getInstagramUrl() != null) existingAlumni.setInstagramUrl(updatedAlumni.getInstagramUrl());
        if (updatedAlumni.getLinkedinUrl() != null) existingAlumni.setLinkedinUrl(updatedAlumni.getLinkedinUrl());

        if (updatedAlumni.getBackgroundPhoto() != null) {
            existingAlumni.setBackgroundPhoto(updatedAlumni.getBackgroundPhoto());
        }

        if (updatedAlumni.getUpassword() != null && !updatedAlumni.getUpassword().isEmpty()) {
            if (!updatedAlumni.getUpassword().startsWith("$2a$") && !updatedAlumni.getUpassword().startsWith("$2b$") && !updatedAlumni.getUpassword().startsWith("$2y$")) { 
                existingAlumni.setUpassword(passwordEncoder.encode(updatedAlumni.getUpassword()));
            } else {
                existingAlumni.setUpassword(updatedAlumni.getUpassword());
            }
        }
        return alumniRepository.save(existingAlumni);
    }

    public Optional<Alumni> findByUemail(String uemail) {
        return alumniRepository.findByUemail(uemail);
    }

    public List<Alumni> searchAlumniByUname(String uname) {
        return alumniRepository.findByUnameContainingIgnoreCase(uname);
    }
}
