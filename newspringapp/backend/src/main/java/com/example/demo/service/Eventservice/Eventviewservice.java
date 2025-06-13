package com.example.demo.service.Eventservice;
import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.repository.Eventrepository.Eventviewrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Eventviewservice {

    @Autowired
    private Eventviewrepository repository;

    public List<EventRegister> getAll() {
        return repository.findAll();
    }

    public Optional<EventRegister> getById(Long id) {
        return repository.findById(id);
    }
}

