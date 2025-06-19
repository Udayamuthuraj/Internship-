package com.example.demo.repository.Eventrepository;

import com.example.demo.model.Eventmodel.Eventmodel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends CrudRepository<Eventmodel, Long> {

    @Query("SELECT e.title FROM Eventmodel e WHERE e.date >= :today ORDER BY e.date ASC")
    List<String> findUpcomingEventTitles(LocalDate today);
}