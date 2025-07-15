package com.example.demo.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing department-wise registration statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentStatsDto {
    private String department;
    private long studentCount;
    private long alumniCount;
}
