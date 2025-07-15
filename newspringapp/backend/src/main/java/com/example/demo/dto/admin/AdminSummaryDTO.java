package com.example.demo.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for summarizing admin details in the dashboard.
 * Used for displaying admin ID, name, email, and profile image.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private String profileImageUrl;
}
