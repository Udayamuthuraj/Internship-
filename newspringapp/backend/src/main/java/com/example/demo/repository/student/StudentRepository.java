package com.example.demo.repository.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.student.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Student findByEmail(String email); // optional, useful for checking duplicates

}
