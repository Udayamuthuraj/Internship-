package com.example.demo.repository;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    com.example.demo.controller.Feedback save(com.example.demo.controller.Feedback feedback);
}
