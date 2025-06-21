package com.example.demo.service.student;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.student.Student;
import com.example.demo.model.student.StudentDetails;
import com.example.demo.repository.student.StudentDetailsRepository;
import com.example.demo.repository.student.StudentRepository;

@Service
public class StudentDetailsService {

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Optional<StudentDetails> getDetailsByStudentId(Long studentId) {
        return studentDetailsRepository.findByStudent_Id(studentId);
    }

    @Transactional
    public StudentDetails updateStudentDetails(Long studentId, StudentDetails updatedDetails) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found with id " + studentId));

        validateStudentDetails(updatedDetails);

        return studentDetailsRepository.findByStudent_Id(studentId).map(existingDetails -> {
            existingDetails.setHeadline(updatedDetails.getHeadline());
            existingDetails.setAbout(updatedDetails.getAbout());
            existingDetails.setEducation(updatedDetails.getEducation());
            existingDetails.setSkills(updatedDetails.getSkills());
            existingDetails.setLinkedinGithub(updatedDetails.getLinkedinGithub());
            existingDetails.setResumeUrl(updatedDetails.getResumeUrl());
            existingDetails.setProfilePicturePath(updatedDetails.getProfilePicturePath());
            existingDetails.setStudent(student);
            return studentDetailsRepository.save(existingDetails);
        }).orElseGet(() -> {
            updatedDetails.setStudent(student);
            return studentDetailsRepository.save(updatedDetails);
        });
    }

@Transactional
public void updateProfilePicture(Long studentId, String path) {
    Student student = studentRepository.findById(studentId)
        .orElseThrow(() -> new RuntimeException("Student not found with id " + studentId));

    StudentDetails details = studentDetailsRepository.findByStudent_Id(studentId)
        .orElseGet(() -> {
            StudentDetails newDetails = new StudentDetails();
            newDetails.setStudent(student);
            return newDetails;
        });

    details.setProfilePicturePath(path);
    studentDetailsRepository.save(details);
}

 @Transactional
public void updateResumeUrl(Long studentId, String resumeUrl) {
    Student student = studentRepository.findById(studentId)
        .orElseThrow(() -> new RuntimeException("Student not found with id " + studentId));

    StudentDetails details = studentDetailsRepository.findByStudent_Id(studentId)
        .orElseGet(() -> {
            StudentDetails newDetails = new StudentDetails();
            newDetails.setStudent(student);
            return newDetails;
        });

    details.setResumeUrl(resumeUrl);
    studentDetailsRepository.save(details);
}

    private void validateStudentDetails(StudentDetails details) {
        if (details == null) {
            throw new IllegalArgumentException("StudentDetails cannot be null");
        }
    }
}
