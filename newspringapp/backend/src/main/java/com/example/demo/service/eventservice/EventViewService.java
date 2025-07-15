package com.example.demo.service.eventservice;

import com.example.demo.model.eventmodel.EventRegister;
import com.example.demo.repository.eventrepository.EventViewRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventViewService {

    private final EventViewRepository repository;

    public EventViewService(EventViewRepository repository) {
        this.repository = repository;
    }

    /**
     * Fetch all registrations for the latest event (based on highest ID)
     */
    public List<EventRegister> getLatestEventRegistrations() {
        return repository.findLatestEventRegistrations()
                .stream()
                .sorted(Comparator.comparing(EventRegister::getCreatedDate).reversed())
                .collect(Collectors.toList());
    }

    /**
     * Fetch single registration by ID
     */
    public EventRegister getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Count registrations by role (e.g., "Student", "Alumni")
     */
    public long countByRole(String role) {
        return repository.findAll().stream()
                .filter(r -> r.getRole() != null && r.getRole().equalsIgnoreCase(role))
                .count();
    }

    /**
     * Optional utility: Get all registrations for a given event title, sorted by created date
     */
    public List<EventRegister> getRegistrationsByEventTitle(String title) {
        return repository.findByEventTitle(title)
                .stream()
                .sorted(Comparator.comparing(EventRegister::getCreatedDate).reversed())
                .collect(Collectors.toList());
    }
}
