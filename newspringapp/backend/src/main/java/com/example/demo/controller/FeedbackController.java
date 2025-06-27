package com.example.demo.controller;

import com.example.demo.model.Feedback;
import com.example.demo.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository repository;

    // Save feedback
    @PostMapping
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        return repository.save(feedback);
    }

    // Get all feedback
    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return repository.findAll();
    }
}
