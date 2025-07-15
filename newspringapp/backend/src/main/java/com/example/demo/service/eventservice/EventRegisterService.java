package com.example.demo.service.eventservice;

import com.example.demo.model.eventmodel.EventRegister;
import com.example.demo.repository.eventrepository.EventRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventRegisterService {

    @Autowired
    private EventRegisterRepository repository;

    /**
     * Save a new event registration, auto-setting createdDate.
     */
    public EventRegister save(EventRegister register) {
        register.setCreatedDate(LocalDateTime.now()); // Ensure createdDate is set manually (if not using @PrePersist)
        return repository.save(register);
    }

    /**
     * Get all registrations.
     */
    public List<EventRegister> getAllRegistrations() {
        return repository.findAll();
    }

    /**
     * Get a registration by ID.
     */
    public Optional<EventRegister> getById(Long id) {
        return repository.findById(id);
    }

    /**
     * Delete a registration by ID.
     */
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    /**
     * Count total number of registrations.
     */
    public long count() {
        return repository.count();
    }

    /**
     * Check if a registration exists by ID.
     */
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
