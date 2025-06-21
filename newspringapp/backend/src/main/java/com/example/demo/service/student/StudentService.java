package com.example.demo.service.student;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.student.Student;
import com.example.demo.repository.student.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register New Student
    public Student registerStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException("Email already registered!");
        }

        String hashedPassword = passwordEncoder.encode(student.getPassword());
        student.setPassword(hashedPassword);

        return studentRepository.save(student);
    }

    // Validate Login Credentials
    public Student validateStudent(String email, String rawPassword) {
        Optional<Student> optionalStudent = studentRepository.findByEmail(email);

        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            if (passwordEncoder.matches(rawPassword, student.getPassword())) {
                return student;
            }
        }
        return null;
    }

    // Check if Email Already Exists
    public boolean checkIfEmailExists(String email) {
        return studentRepository.existsByEmail(email);
    }

    // Get All Students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get Student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Get Student by Email
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    // Delete Student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // Update Student Profile
    public Student updateStudentProfile(Long id, Student updatedData) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isEmpty()) {
            throw new RuntimeException("Student not found");
        }

        Student student = optionalStudent.get();
        student.setName(updatedData.getName());
        student.setDepartment(updatedData.getDepartment());
        student.setBatch(updatedData.getBatch());
        return studentRepository.save(student);
    }
}
