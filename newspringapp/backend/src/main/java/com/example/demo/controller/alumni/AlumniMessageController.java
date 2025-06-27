package com.example.demo.controller.alumni;

import com.example.demo.model.alumni.AlumniMessage;
import com.example.demo.service.alumni.AlumniMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniMessageController {

    @Autowired
    private AlumniMessageService messageService;

    @GetMapping
    public ResponseEntity<List<AlumniMessage>> getMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getUserMessages(userId));
    }

    @PostMapping
    public ResponseEntity<AlumniMessage> sendMessage(@PathVariable Long userId, @RequestBody AlumniMessage message) {
        message.setSenderId(userId);
        return ResponseEntity.ok(messageService.sendMessage(message));
    }
}
