package com.example.demo.service.admin;

import com.example.demo.dto.admin.AdminSummaryDTO;
import com.example.demo.model.admin.Admin;
import com.example.demo.repository.admin.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    /**
     * Fetch all admins as summary DTOs for listing (id, name, email, profileImageUrl).
     * @return List of AdminSummaryDTO
     */
    public List<AdminSummaryDTO> getAllAdminSummaries() {
        return adminRepository.findAllAdminSummaries();
    }

    /**
     * Delete admin by ID.
     * @param id Admin ID to delete
     * @throws IllegalArgumentException if admin not found
     */
    public void deleteAdminById(Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Admin with ID " + id + " not found.");
        }
    }
}
