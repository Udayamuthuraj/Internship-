package com.example.demo.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Generic method to send an HTML email.
     */
    public void sendEmail(String toEmail, String subject, String htmlContent) throws MessagingException {
        if (!StringUtils.hasText(toEmail) || !StringUtils.hasText(subject)) {
            throw new IllegalArgumentException("❌ Recipient email and subject must not be empty.");
        }

        toEmail = toEmail.trim().toLowerCase(); // Normalize email

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("✅ Email successfully sent to {}", toEmail);
        } catch (MailException e) {
            log.error("❌ Failed to send email to {}: {}", toEmail, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Sends an OTP verification email.
     */
    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
        String subject = "One-Time Password (OTP) for Verification";
        String body = String.format("""
            <p>Dear User,</p>
            <p>We received a request to verify your email address. Please use the OTP below to proceed:</p>
            <h2>%s</h2>
            <p>This OTP is valid for 15 minutes. Kindly do not share this code with anyone.</p>
            <p>If you did not initiate this request, please ignore this email.</p>
            <br>
            <p>Best regards,<br><strong>Alumni Connect Portal Team</strong></p>
        """, otp);

        sendEmail(toEmail, subject, body);
    }

    /**
     * Sends an OTP for password reset.
     */
    public void sendResetPasswordEmail(String toEmail, String otp) throws MessagingException {
        String subject = "Password Reset Request – OTP Inside";
        String body = String.format("""
            <p>Dear User,</p>
            <p>You have requested to reset your password. Use the OTP below to complete the process:</p>
            <h2>%s</h2>
            <p>This OTP will expire in 15 minutes. Please keep it confidential.</p>
            <p>If you did not make this request, we recommend changing your password immediately.</p>
            <br>
            <p>Regards,<br><strong>Alumni Connect Portal Team</strong></p>
        """, otp);

        sendEmail(toEmail, subject, body);
    }

    /**
     * Sends a feedback reply email.
     */
    public void sendFeedbackReplyEmail(String toEmail, String subject, String replyMessage, String originalFeedback) throws MessagingException {
        String feedback = originalFeedback != null ? originalFeedback : "(Not provided)";
        String reply = replyMessage != null ? replyMessage : "(No reply provided)";

        String body = String.format("""
            <p>Dear User,</p>
            <p>Thank you for your recent feedback. Please find our response below:</p>
            <hr>
            <p><strong>Your Feedback:</strong><br>%s</p>
            <p><strong>Admin Response:</strong><br>%s</p>
            <hr>
            <p>We appreciate your input and are committed to improving your experience.</p>
            <br>
            <p>Sincerely,<br><strong>Alumni Connect Support Team</strong></p>
        """, feedback, reply);

        sendEmail(toEmail, subject, body);
    }

    /**
     * Sends a notification email upon account deletion.
     */
    public void sendDeletionEmail(String toEmail, String userName, String role, String reason) throws MessagingException {
        String name = (userName != null && !userName.isBlank()) ? userName : "User";
        String roleLabel = (role != null && !role.isBlank()) ? role : "your";
        String deletionReason = (reason != null && !reason.isBlank()) ? reason : "No specific reason provided.";

        String subject = "Account Deletion Notice – Alumni Connect Portal";
        String body = String.format("""
            <p>Dear %s,</p>
            <p>We regret to inform you that your <strong>%s</strong> account has been deleted by an administrator on the Alumni Connect Portal.</p>
            <p><strong>Reason for deletion:</strong><br>%s</p>
            <p>If you believe this was a mistake, please contact our support team at your earliest convenience.</p>
            <br>
            <p>Warm regards,<br><strong>Alumni Connect Admin Team</strong></p>
        """, name, roleLabel, deletionReason);

        sendEmail(toEmail, subject, body);
    }
}
