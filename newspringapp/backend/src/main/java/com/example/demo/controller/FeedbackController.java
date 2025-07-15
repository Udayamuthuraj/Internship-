package com.example.demo.controller;

import com.example.demo.model.Feedback;
import com.example.demo.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    // ✅ Submit feedback
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        if (feedback.getName() == null || feedback.getName().trim().isEmpty() ||
            feedback.getEmail() == null || feedback.getEmail().trim().isEmpty() ||
            feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, email, and message are required."));
        }

        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get all feedbacks sorted by latest
    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
        return ResponseEntity.ok(feedbacks);
    }

    // ✅ Mark feedback as replied manually (optional fallback)
    @PutMapping("/{id}/mark-replied")
    public ResponseEntity<?> markAsReplied(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return feedbackRepository.findById(id).map(feedback -> {
            feedback.setReplied(true);
            feedback.setAdminReply(body.getOrDefault("adminReply", ""));
            feedbackRepository.save(feedback);
            return ResponseEntity.ok(Map.of("message", "Feedback marked as replied"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Feedback not found")));
    }
}
