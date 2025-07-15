package com.example.demo.repository.student;

import com.example.demo.model.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // 🔍 Find a student by email
    Optional<Student> findByEmail(String email);

    // ✅ Check if a student exists by email
    boolean existsByEmail(String email);

    // 📧 Get all registered student emails
    @Query("SELECT s.email FROM Student s WHERE s.email IS NOT NULL")
    List<String> findAllEmails();

    // 🔄 Filter by batch
    List<Student> findByBatch(String batch);

    // 🔄 Filter by department
    List<Student> findByDepartment(String department);

    // 🔄 Filter by both batch and department
    List<Student> findByBatchAndDepartment(String batch, String department);

    // 📊 Get all distinct departments (for dashboard charts)
    @Query("SELECT DISTINCT s.department FROM Student s")
    List<String> findDistinctDepartments();

    // 📈 Count number of students in a specific department
    long countByDepartment(String department);
     @Query("SELECT new com.example.demo.dto.student.StudentSummaryDTO(s.id, s.name, s.email, s.department, s.batch) FROM Student s")
    List<com.example.demo.dto.student.StudentSummaryDTO> findAllStudentSummaries();



    

    // 📉 (Optional) Group by department and return count (if you want to use this for a chart)
    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countByDepartmentGrouped();
}
