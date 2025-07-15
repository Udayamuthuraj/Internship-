package com.example.demo.service.admin;

import com.example.demo.dto.admin.FeedbackReplyRequest;
import com.example.demo.model.Feedback;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.alumni.AlumniRepository;
import com.example.demo.repository.student.StudentRepository;
import com.example.demo.utils.EmailService;
import com.example.demo.utils.OTPStorageService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminEmailService {

    private final OTPStorageService otpStorageService;
    private final EmailService emailService;
    private final StudentRepository studentRepository;
    private final AlumniRepository alumniRepository;
    private final FeedbackRepository feedbackRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * ✅ Sends OTP to the admin's email address.
     */
    public String sendOtp(String email) {
        if (!StringUtils.hasText(email) || !email.contains("@")) {
            log.warn("⚠️ Invalid email provided for OTP: '{}'", email);
            return "Invalid email address.";
        }

        email = email.trim().toLowerCase();

        try {
            String otp = otpStorageService.generateOTP(email);

            String subject = "Email Verification – Alumni Connect Portal";
            String body = String.format("""
                <p>Dear Administrator,</p>
                <p>Please use the following One-Time Password (OTP) to complete your verification process:</p>
                <h2>%s</h2>
                <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
                <br>
                <p>Best regards,<br><strong>Alumni Connect Team</strong></p>
            """, otp);

            emailService.sendEmail(email, subject, body);
            log.info("✅ OTP sent to {}", email);
            return "OTP has been sent successfully to your email.";
        } catch (MessagingException e) {
            log.error("❌ Failed to send OTP to {}: {}", email, e.getMessage());
            return "Failed to send OTP. Please try again later.";
        }
    }

    /**
     * ✅ Sends event notification emails to all students and alumni.
     */
    public String sendEventNotificationToAll(String subject, String message) {
        try {
            List<String> studentEmails = studentRepository.findAllEmails();
            List<String> alumniEmails = alumniRepository.findAllEmails();

            String body = String.format("""
                <p>Dear Member,</p>
                <p>%s</p>
                <br>
                <p>We look forward to your participation.</p>
                <p>Warm regards,<br><strong>Alumni Connect Team</strong></p>
            """, message.replace("\n", "<br>"));

            for (String email : studentEmails) {
                emailService.sendEmail(email.trim().toLowerCase(), subject, body);
            }

            for (String email : alumniEmails) {
                emailService.sendEmail(email.trim().toLowerCase(), subject, body);
            }

            log.info("📢 Event emails sent to {} students and {} alumni.", studentEmails.size(), alumniEmails.size());
            return "Event notification emails sent successfully.";
        } catch (MessagingException e) {
            log.error("❌ Failed to send event emails: {}", e.getMessage());
            return "Failed to send event notification emails.";
        }
    }

    /**
     * ✅ Sends a reply to a specific feedback entry and updates the database.
     */
    public String sendReplyToFeedback(FeedbackReplyRequest request) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(request.getFeedbackId());

        if (optionalFeedback.isEmpty()) {
            return "Feedback record not found.";
        }

        Feedback feedback = optionalFeedback.get();

        String recipientName = (feedback.getName() != null && !feedback.getName().trim().isEmpty())
                ? feedback.getName().trim()
                : "User";

        String subject = StringUtils.hasText(request.getSubject())
                ? request.getSubject()
                : "Response to Your Feedback – Alumni Connect Portal";

        String body = String.format("""
            <p>Dear %s,</p>
            <p>Thank you for sharing your feedback with us. Below is our response:</p>
            <hr>
            <p><strong>Your Feedback:</strong><br>%s</p>
            <p><strong>Admin Reply:</strong><br>%s</p>
            <hr>
            <p>We value your input and appreciate your engagement with the Alumni Connect Portal.</p>
            <br>
            <p>Sincerely,<br><strong>Alumni Connect Support Team</strong></p>
        """, recipientName, request.getOriginalFeedback(), request.getMessage());

        try {
            emailService.sendEmail(request.getEmail().trim().toLowerCase(), subject, body);

            feedback.setAdminReply(request.getMessage());
            feedback.setReplied(true);
            feedbackRepository.save(feedback);

            log.info("✅ Reply sent to {} and feedback updated.", request.getEmail());
            return "Reply sent and feedback updated successfully.";
        } catch (MessagingException e) {
            log.error("❌ Failed to send feedback reply to {}: {}", request.getEmail(), e.getMessage());
            return "Failed to send reply. Please try again.";
        }
    }
}
