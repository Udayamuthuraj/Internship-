package com.example.demo.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackReplyRequest {
    private Long feedbackId;         // ✅ Feedback ID to update in DB
    private String email;            // Recipient's email address
    private String subject;          // Subject of the reply
    private String message;          // Admin's reply content
    private String originalFeedback; // (Optional) Original feedback message
}
