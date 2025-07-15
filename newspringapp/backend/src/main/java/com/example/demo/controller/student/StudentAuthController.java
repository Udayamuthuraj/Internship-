package com.example.demo.controller.student;

import com.example.demo.dto.student.*;
import com.example.demo.model.student.Student;
import com.example.demo.service.student.StudentAuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/auth")
public class StudentAuthController {

    @Autowired
    private StudentAuthService studentAuthService;

    /**
     * Registers a new student with OTP verification.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerStudent(@RequestBody StudentRegisterRequest request) {
        String result = studentAuthService.registerStudent(request);
        return result.equals("Student registered successfully.")
                ? ResponseEntity.ok(result)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * Logs in the student and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody StudentLoginRequest request) {
        try {
            StudentLoginResponse response = studentAuthService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    /**
     * Checks if email is already registered (frontend validation).
     */
    @GetMapping("/email-exists")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        boolean exists = studentAuthService.checkEmailExists(email);
        return ResponseEntity.ok(exists);
    }

    /**
     * 🔍 Get students by batch.
     */
    @GetMapping("/filter/batch/{batch}")
    public ResponseEntity<List<Student>> getStudentsByBatch(@PathVariable String batch) {
        return ResponseEntity.ok(studentAuthService.getStudentsByBatch(batch));
    }

    /**
     * 🔍 Get students by department.
     */
    @GetMapping("/filter/department/{department}")
    public ResponseEntity<List<Student>> getStudentsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(studentAuthService.getStudentsByDepartment(department));
    }
}
