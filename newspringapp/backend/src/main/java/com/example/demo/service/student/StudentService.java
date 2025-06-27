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
    private PasswordEncoder passwordEncoder; // Inject encoder

    // 🔹 For Registration
    public Student registerStudent(Student student) {
        if (studentRepository.findByEmail(student.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered!");
        }
        String hashedPassword = passwordEncoder.encode(student.getPassword());
        student.setPassword(hashedPassword);

        return studentRepository.save(student);
    }

    // for login validation
    public Student validateStudent(String email, String rawPassword) {
    Student student = studentRepository.findByEmail(email);

    if (student != null && passwordEncoder.matches(rawPassword, student.getPassword())) {
        return student;
    } else {
        return null;
    }
}


    // check if email is registered  
   public boolean checkIfEmailExists(String email) {
    return studentRepository.findByEmail(email) != null;
}


    // 🔹 Fetch All Students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // 🔹 Get Student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // 🔹 Delete Student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}
