package com.example.demo.repository.student;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.student.StudentDetails;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, Long> {

    // Find StudentDetails by studentId (foreign key)
    Optional<StudentDetails> findByStudent_Id(Long studentId);
}
