package com.example.demo.repository.alumni;

import com.example.demo.model.alumni.Alumni;
import com.example.demo.dto.alumni.AlumniSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {

    // 🔍 Find alumni by email
    Optional<Alumni> findByEmail(String email);

    // ✅ Check if an alumni exists by email
    boolean existsByEmail(String email);

    // 📧 Get all registered alumni emails
    @Query("SELECT a.email FROM Alumni a WHERE a.email IS NOT NULL")
    List<String> findAllEmails();

    // 🔍 Filter alumni by batch
    List<Alumni> findByBatch(String batch);

    // 🔍 Filter alumni by department
    List<Alumni> findByDepartment(String department);

    // 🔍 Filter alumni by both batch and department
    List<Alumni> findByBatchAndDepartment(String batch, String department);

    // 📊 Get all distinct departments (for dashboard use)
    @Query("SELECT DISTINCT a.department FROM Alumni a")
    List<String> findDistinctDepartments();

    // 📈 Count alumni in a specific department
    long countByDepartment(String department);

    // 📊 Grouped count by department (optional for dashboard/chart)
    @Query("SELECT a.department, COUNT(a) FROM Alumni a GROUP BY a.department")
    List<Object[]> countByDepartmentGrouped();

    // 📋 Get summary of alumni for frontend listing (DTO projection)
    @Query("SELECT new com.example.demo.dto.alumni.AlumniSummaryDTO(a.id, a.name, a.email, a.department, a.batch) FROM Alumni a")
    List<AlumniSummaryDTO> findAllAlumniSummaries();
}
