package com.example.demo.repository.eventrepository;

import com.example.demo.model.eventmodel.EventModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<EventModel, Long> {

    @Query("SELECT e.title FROM EventModel e WHERE e.date >= :today ORDER BY e.date ASC")
    List<String> findUpcomingEventTitles(LocalDate today);

    // Optional extra methods
    List<EventModel> findByDateAfterOrderByDateAsc(LocalDate date);

    List<EventModel> findByTitleContainingIgnoreCase(String title);
}

