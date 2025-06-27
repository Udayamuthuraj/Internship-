package com.example.demo.controller.alumni;

import com.example.demo.model.alumni.AlumniActivity;
import com.example.demo.service.alumni.AlumniActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniActivityController {

    @Autowired
    private AlumniActivityService service;

    @GetMapping("/{userId}")
    public ResponseEntity<List<AlumniActivity>> getActivities(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getActivitiesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<AlumniActivity> saveActivity(@RequestBody AlumniActivity activity) {
        return ResponseEntity.ok(service.saveActivity(activity));
    }
}
