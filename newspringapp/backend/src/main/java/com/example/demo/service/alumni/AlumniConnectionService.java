package com.example.demo.service.alumni;

import com.example.demo.model.alumni.AlumniConnection;
import com.example.demo.repository.alumni.AlumniConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlumniConnectionService {

    @Autowired
    private AlumniConnectionRepository repository;

    public List<AlumniConnection> getConnections(Long userId1, Long userId2) {
        return repository.findByUserId1OrUserId2(userId1, userId2);
    }

    public AlumniConnection saveConnection(AlumniConnection connection) {
        return repository.save(connection);
    }
}
