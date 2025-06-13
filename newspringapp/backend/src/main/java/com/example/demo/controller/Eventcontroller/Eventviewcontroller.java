package com.example.demo.controller.Eventcontroller;
import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.service.Eventservice.Eventviewservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/view-registrations")
@CrossOrigin(origins = "http://localhost:3000")
public class Eventviewcontroller {

    @Autowired
    private Eventviewservice service;

    @GetMapping
    public ResponseEntity<List<EventRegister>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRegister> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

