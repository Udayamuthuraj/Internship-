package com.example.demo.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for returning summarized student data to the admin dashboard.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentSummaryDTO {
    private Long id;            // <-- Added this
    private String name;
    private String email;
    private String department;
    private String batch;
}
