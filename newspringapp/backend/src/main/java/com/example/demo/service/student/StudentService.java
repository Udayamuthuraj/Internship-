package com.example.demo.service.student;

import com.example.demo.dto.student.StudentSummaryDTO;
import com.example.demo.model.student.Student;
import com.example.demo.repository.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for handling student-related business logic.
 */
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    /**
     * Get all students.
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Get a student by email.
     */
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    /**
     * Check if a student exists by email.
     */
    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    /**
     * Get all registered student emails.
     */
    public List<String> getAllStudentEmails() {
        return studentRepository.findAllEmails();
    }

    /**
     * Get students by batch.
     */
    public List<Student> getStudentsByBatch(String batch) {
        return studentRepository.findByBatch(batch);
    }

    /**
     * Get students by department.
     */
    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    /**
     * Get students by both batch and department.
     */
    public List<Student> getStudentsByBatchAndDepartment(String batch, String department) {
        return studentRepository.findByBatchAndDepartment(batch, department);
    }

    /**
     * Get list of all distinct departments.
     */
    public List<String> getDistinctDepartments() {
        return studentRepository.findDistinctDepartments();
    }

    /**
     * Count students by department.
     */
    public long countByDepartment(String department) {
        return studentRepository.countByDepartment(department);
    }

    /**
     * Get summarized student data (for dashboard use).
     */
    public List<StudentSummaryDTO> getAllStudentSummaries() {
        return studentRepository.findAllStudentSummaries();
    }

    /**
     * Delete a student by ID.
     */
    public void deleteStudentById(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Student with ID " + id + " not found.");
        }
    }
}
