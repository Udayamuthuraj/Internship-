package com.example.demo.controller.student;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.student.Student;
import com.example.demo.service.student.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerStudent(@Valid @RequestBody Student student) {
        Map<String, Object> response = new HashMap<>();
        try {
            Student savedStudent = studentService.registerStudent(student);
            response.put("status", "success");
            response.put("message", "🎉 Student registered successfully!");
            response.put("studentId", savedStudent.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "❌ Registration failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody Student loginData) {
        Student student = studentService.validateStudent(loginData.getEmail(), loginData.getPassword());

        if (student != null) {
            return ResponseEntity.ok(Map.of(
                "name", student.getName(),
                "email", student.getEmail()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
    boolean exists = studentService.checkIfEmailExists(email);
    return ResponseEntity.ok(exists);
}

}
