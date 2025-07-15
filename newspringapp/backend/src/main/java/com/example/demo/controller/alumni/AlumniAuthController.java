package com.example.demo.controller.alumni;

import com.example.demo.dto.alumni.*;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.service.alumni.AlumniAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni/auth")
public class AlumniAuthController {

    @Autowired
    private AlumniAuthService alumniAuthService;

    /**
     * Registers a new alumni with OTP verification.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerAlumni(@RequestBody AlumniRegisterRequest request) {
        String result = alumniAuthService.registerAlumni(request);
        if (result.equals("Alumni registered successfully.")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * Logs in the alumni and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginAlumni(@RequestBody AlumniLoginRequest request) {
        try {
            AlumniLoginResponse response = alumniAuthService.login(request);
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
        boolean exists = alumniAuthService.checkEmailExists(email);
        return ResponseEntity.ok(exists);
    }

    /**
     * Gets alumni list filtered by batch year.
     */
    @GetMapping("/filter-by-batch")
    public ResponseEntity<List<Alumni>> getAlumniByBatch(@RequestParam String batch) {
        List<Alumni> alumniList = alumniAuthService.getAlumniByBatch(batch);
        return ResponseEntity.ok(alumniList);
    }

    /**
     * Gets alumni list filtered by department.
     */
    @GetMapping("/filter-by-department")
    public ResponseEntity<List<Alumni>> getAlumniByDepartment(@RequestParam String department) {
        List<Alumni> alumniList = alumniAuthService.getAlumniByDepartment(department);
        return ResponseEntity.ok(alumniList);
    }
}
