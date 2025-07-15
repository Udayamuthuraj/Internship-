package com.example.demo.repository.admin;

import com.example.demo.dto.admin.AdminSummaryDTO;
import com.example.demo.model.admin.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Find admin by email
    Optional<Admin> findByEmail(String email);

    // Check if email is already registered
    boolean existsByEmail(String email);

    // Optional: Find admin by ID and email (useful during email verification)
    Optional<Admin> findByIdAndEmail(Long id, String email);

    // ✅ Admin summary projection for dashboard
    @Query("SELECT new com.example.demo.dto.admin.AdminSummaryDTO(a.id, a.name, a.email, a.profileImageUrl) FROM Admin a")
    List<AdminSummaryDTO> findAllAdminSummaries();
}
