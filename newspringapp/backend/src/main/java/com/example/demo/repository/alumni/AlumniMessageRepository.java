package com.example.demo.repository.alumni;

import com.example.demo.model.alumni.AlumniMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlumniMessageRepository extends JpaRepository<AlumniMessage, Long> {
    List<AlumniMessage> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}
