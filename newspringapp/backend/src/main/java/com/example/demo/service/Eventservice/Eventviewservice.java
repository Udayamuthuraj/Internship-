package com.example.demo.service.Eventservice;

import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.repository.Eventrepository.EventViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventViewService {

    @Autowired
    private EventViewRepository repository;

    public List<EventRegister> getLatestEventRegistrations() {
        return repository.findLatestEventRegistrations();
    }

    public EventRegister getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public long countByRole(String role) {
        return repository.findAll().stream()
                .filter(r -> r.getRole().equalsIgnoreCase(role))
                .count();
    }
}
