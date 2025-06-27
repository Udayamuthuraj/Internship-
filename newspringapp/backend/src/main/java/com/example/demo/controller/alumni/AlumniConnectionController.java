package com.example.demo.controller.alumni;

import com.example.demo.model.alumni.AlumniConnection;
import com.example.demo.service.alumni.AlumniConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni/connection")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniConnectionController {

    @Autowired
    private AlumniConnectionService service;

    @GetMapping("/{userId}")
    public ResponseEntity<List<AlumniConnection>> getConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getConnections(userId, userId));
    }

    @PostMapping
    public ResponseEntity<AlumniConnection> saveConnection(@RequestBody AlumniConnection connection) {
        return ResponseEntity.ok(service.saveConnection(connection));
    }
}

