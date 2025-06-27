package com.example.demo.service.alumni;

import com.example.demo.model.alumni.AlumniMessage;
import com.example.demo.repository.alumni.AlumniMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlumniMessageService {

    @Autowired
    private AlumniMessageRepository messageRepository;

    public List<AlumniMessage> getUserMessages(Long userId) {
        return messageRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    public AlumniMessage sendMessage(AlumniMessage msg) {
        msg.setSentAt(LocalDateTime.now());
        return messageRepository.save(msg);
    }
}
