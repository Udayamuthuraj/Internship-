package com.example.demo.controller.alumni;

import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import com.example.demo.repository.alumni.AlumniPostRepository;
import com.example.demo.repository.alumni.AlumniMessageRepository;
import com.example.demo.repository.alumni.AlumniConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniDashboardController {

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private AlumniPostRepository postRepository;

    @Autowired
    private AlumniMessageRepository messageRepository;

    @Autowired
    private AlumniConnectionRepository connectionRepository;

    @GetMapping("/{userId}")
    public Map<String, Object> getDashboardStats(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", alumniRepository.count());
        stats.put("totalPosts", postRepository.count());
        stats.put("totalMessages", messageRepository.count());
        stats.put("totalConnections", connectionRepository.count());
        return stats;
    }
}