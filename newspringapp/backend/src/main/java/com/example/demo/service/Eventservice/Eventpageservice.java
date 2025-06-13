package com.example.demo.service.Eventservice;

import com.example.demo.model.Eventmodel.Eventmodel;
import com.example.demo.repository.Eventrepository.EventpageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Eventpageservice {

    @Autowired
    private EventpageRepository eventRepository;

    public List<Eventmodel> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Eventmodel> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Optional<Eventmodel> getEventByTitle(String title) {
        return eventRepository.findByTitle(title);
    }
} 