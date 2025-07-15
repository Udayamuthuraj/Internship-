package com.example.demo.repository.eventrepository;

import com.example.demo.model.eventmodel.EventRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventViewRepository extends JpaRepository<EventRegister, Long> {

    List<EventRegister> findByEventTitle(String eventTitle);

    @Query(value = "SELECT * FROM event_register WHERE event_title = (SELECT event_title FROM event_register ORDER BY id DESC LIMIT 1)", nativeQuery = true)
    List<EventRegister> findLatestEventRegistrations();
}

