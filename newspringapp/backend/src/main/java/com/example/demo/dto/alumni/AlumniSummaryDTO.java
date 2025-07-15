package com.example.demo.dto.alumni;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String batch;
}
