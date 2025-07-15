package com.example.demo.controller.admin;

import com.example.demo.dto.admin.AdminSummaryDTO;
import com.example.demo.dto.admin.DashboardStatsDto;
import com.example.demo.dto.admin.DepartmentStatsDto;
import com.example.demo.dto.alumni.AlumniSummaryDTO;
import com.example.demo.dto.common.DeleteRequest;
import com.example.demo.dto.student.StudentSummaryDTO;
import com.example.demo.service.admin.AdminDashboardService;
import com.example.demo.service.alumni.AlumniService;
import com.example.demo.service.student.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling admin dashboard-related APIs.
 * Base URL: /api/admin/dashboard
 */
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;
    private final StudentService studentService;
    private final AlumniService alumniService;

    /**
     * GET /stats
     * Fetches overall dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }

    /**
     * GET /department-stats
     * Fetches department-wise distribution of students and alumni.
     */
    @GetMapping("/department-stats")
    public ResponseEntity<List<DepartmentStatsDto>> getDepartmentStats() {
        return ResponseEntity.ok(adminDashboardService.getDepartmentStats());
    }

    /**
     * GET /students
     * Fetches summaries of all students.
     */
    @GetMapping("/students")
    public ResponseEntity<List<StudentSummaryDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudentSummaries());
    }

    /**
     * DELETE /students/{id}
     * Deletes a student and sends an email notification.
     */
    @DeleteMapping("/students/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id,
            @Valid @RequestBody DeleteRequest request) {
        adminDashboardService.deleteStudentById(id, request);
        return ResponseEntity.ok("✅ Student (ID: " + id + ") deleted successfully.");
    }

    /**
     * GET /alumni
     * Fetches summaries of all alumni.
     */
    @GetMapping("/alumni")
    public ResponseEntity<List<AlumniSummaryDTO>> getAllAlumni() {
        return ResponseEntity.ok(alumniService.getAllAlumniSummaries());
    }

    /**
     * DELETE /alumni/{id}
     * Deletes an alumni and sends an email notification.
     */
    @DeleteMapping("/alumni/{id}")
    public ResponseEntity<String> deleteAlumni(
            @PathVariable Long id,
            @Valid @RequestBody DeleteRequest request) {
        adminDashboardService.deleteAlumniById(id, request);
        return ResponseEntity.ok("✅ Alumni (ID: " + id + ") deleted successfully.");
    }

    /**
     * GET /admins
     * Fetches summaries of all admins.
     */
    @GetMapping("/admins")
    public ResponseEntity<List<AdminSummaryDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminDashboardService.getAllAdminSummaries());
    }

    /**
     * DELETE /admins/{id}
     * Deletes an admin and sends an email notification.
     */
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<String> deleteAdmin(
            @PathVariable Long id,
            @Valid @RequestBody DeleteRequest request) {
        adminDashboardService.deleteAdminById(id, request);
        return ResponseEntity.ok("✅ Admin (ID: " + id + ") deleted successfully.");
    }
}
