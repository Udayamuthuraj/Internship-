package com.example.demo.repository.eventrepository;

import com.example.demo.model.eventmodel.EventModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventPageRepository extends JpaRepository<EventModel, Long> {
    Optional<EventModel> findByTitle(String title);
}

