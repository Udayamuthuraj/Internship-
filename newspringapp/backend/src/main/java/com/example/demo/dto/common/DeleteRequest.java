package com.example.demo.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for receiving deletion request details from the frontend.
 * Used by AdminDashboardController for deleting students or alumni
 * and notifying them via email with a reason.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteRequest {

    /**
     * Email address of the user to notify.
     */
    private String email;

    /**
     * Full name of the user being deleted.
     */
    private String name;

    /**
     * Reason for deletion (e.g., "Fake Student", "Moved to Alumni").
     */
    private String reason;
}
