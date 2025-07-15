package com.example.demo.service.admin;

import com.example.demo.dto.admin.BroadcastEmailRequest;
import com.example.demo.model.admin.BroadcastEmail;
import com.example.demo.repository.admin.BroadcastEmailRepository;
import com.example.demo.repository.alumni.AlumniRepository;
import com.example.demo.repository.student.StudentRepository;
import com.example.demo.utils.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BroadcastEmailService {

    private final BroadcastEmailRepository broadcastEmailRepository;
    private final StudentRepository studentRepository;
    private final AlumniRepository alumniRepository;
    private final EmailService emailService;

    /**
     * Sends a broadcast email to students, alumni, or all.
     */
    public void sendBroadcast(BroadcastEmailRequest request) throws MessagingException {
        String subject = request.getSubject();
        String message = request.getMessage();
        String recipientType = request.getRecipientType();

        if (isBlank(subject) || isBlank(message)) {
            throw new IllegalArgumentException("Subject and message must not be empty.");
        }

        // 🔍 Determine recipients
        Set<String> recipients = new HashSet<>();
        switch (recipientType) {
            case "Students" -> recipients.addAll(Optional.ofNullable(studentRepository.findAllEmails()).orElse(Collections.emptyList()));
            case "Alumni" -> recipients.addAll(Optional.ofNullable(alumniRepository.findAllEmails()).orElse(Collections.emptyList()));
            case "All" -> {
                recipients.addAll(Optional.ofNullable(studentRepository.findAllEmails()).orElse(Collections.emptyList()));
                recipients.addAll(Optional.ofNullable(alumniRepository.findAllEmails()).orElse(Collections.emptyList()));
            }
            default -> throw new IllegalArgumentException("Invalid recipient type: " + recipientType);
        }

        if (recipients.isEmpty()) {
            log.warn("⚠️ No recipients found for type: {}", recipientType);
            return;
        }

        // 🖋 Compose professional HTML email
        String formattedBody = formatBroadcastEmail(recipientType, message);

        log.info("📨 Sending broadcast to {} recipients...", recipients.size());

        int successCount = 0;
        int failureCount = 0;

        for (String email : recipients) {
            try {
                emailService.sendEmail(email, subject, formattedBody);
                log.info("✅ Sent to {}", email);
                successCount++;
            } catch (MessagingException e) {
                log.error("❌ Failed to send to {}: {}", email, e.getMessage());
                failureCount++;
            }
        }

        // 💾 Store broadcast
        BroadcastEmail record = new BroadcastEmail();
        record.setSubject(subject);
        record.setMessage(message);
        record.setRecipientType(recipientType);
        record.setTimestamp(LocalDateTime.now());
        broadcastEmailRepository.save(record);

        log.info("📌 Broadcast saved. Total: {}, Success: {}, Failed: {}", recipients.size(), successCount, failureCount);
    }

    /**
     * Returns a list of all past broadcasts in reverse chronological order.
     */
    public List<BroadcastEmail> getAllBroadcasts() {
        return broadcastEmailRepository.findAllByOrderByTimestampDesc();
    }

    /**
     * Formats a professional HTML email based on recipient type.
     */
    private String formatBroadcastEmail(String recipientType, String message) {
        String greeting = switch (recipientType) {
            case "Students" -> "Dear Student,";
            case "Alumni" -> "Dear Alumnus/Alumna,";
            case "All" -> "Dear Member,";
            default -> "Dear Recipient,";
        };

        return String.format("""
            <p>%s</p>
            <p>%s</p>
            <br>
            <p>Thank you for staying connected with us.</p>
            <p>Warm regards,<br><strong>Alumni Connect Portal Team</strong></p>
        """, greeting, message.replace("\n", "<br>"));
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
