package com.example.demo.controller.admin;

import com.example.demo.dto.admin.BroadcastEmailRequest;
import com.example.demo.model.admin.BroadcastEmail;
import com.example.demo.service.admin.BroadcastEmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/broadcast")
@CrossOrigin(origins = "*") // Update with frontend origin in production
public class AdminBroadcastController {

    private final BroadcastEmailService broadcastEmailService;

    /**
     * 📬 Send a broadcast email to Students, Alumni, or All.
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendBroadcastEmail(@RequestBody BroadcastEmailRequest request) {
        try {
            broadcastEmailService.sendBroadcast(request);
            return ResponseEntity.ok("Broadcast email sent successfully.");
        } catch (IllegalArgumentException e) {
            log.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (MessagingException e) {
            log.error("Email sending failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("❌ Failed to send emails.");
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("❌ Server error while sending broadcast.");
        }
    }

    /**
     * 📄 Get all broadcast emails (latest first).
     */
    @GetMapping("/all")
    public ResponseEntity<List<BroadcastEmail>> getAllBroadcasts() {
        List<BroadcastEmail> broadcasts = broadcastEmailService.getAllBroadcasts();
        return ResponseEntity.ok(broadcasts);
    }
}
