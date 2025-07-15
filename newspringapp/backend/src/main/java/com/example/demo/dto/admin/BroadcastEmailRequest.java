package com.example.demo.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BroadcastEmailRequest {

    private String subject;
    private String message;
    private String recipientType; // "All", "Students", or "Alumni"
}
