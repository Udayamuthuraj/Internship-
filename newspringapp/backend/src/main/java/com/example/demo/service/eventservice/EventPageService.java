package com.example.demo.service.eventservice;

import com.example.demo.model.eventmodel.EventModel;
import com.example.demo.repository.eventrepository.EventPageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventPageService {

    private final EventPageRepository eventRepository;

    // ✅ Constructor-based injection (cleaner & testable)
    public EventPageService(EventPageRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // ✅ Fetch all events
    public List<EventModel> getAllEvents() {
        return eventRepository.findAll();
    }

    // ✅ Fetch event by ID
    public Optional<EventModel> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    // ✅ Fetch event by Title (exact match)
    public Optional<EventModel> getEventByTitle(String title) {
        return eventRepository.findByTitle(title);
    }

    // ✅ Optional: Fetch all events ordered by createdDate descending
    public List<EventModel> getEventsByNewestFirst() {
        return eventRepository.findAll()
                .stream()
                .sorted((e1, e2) -> e2.getCreatedDate().compareTo(e1.getCreatedDate()))
                .toList();
    }
}
