package com.example.demo.repository.alumni;

import com.example.demo.model.alumni.AlumniConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlumniConnectionRepository extends JpaRepository<AlumniConnection, Long> {
    List<AlumniConnection> findByUserId1OrUserId2(Long userId1, Long userId2);
}
