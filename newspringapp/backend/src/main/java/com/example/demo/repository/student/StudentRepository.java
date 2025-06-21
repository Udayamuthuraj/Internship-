package com.example.demo.repository.student;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.student.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // To find student by email (useful for login or duplicate checks)
    Optional<Student> findByEmail(String email);

    // To check existence by email (faster than fetching full student)
    boolean existsByEmail(String email);
}
