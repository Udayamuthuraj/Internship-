package com.example.demo.repository.Eventrepository;

import com.example.demo.model.Eventmodel.EventRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventViewRepository extends JpaRepository<EventRegister, Long> {

    List<EventRegister> findByEventTitle(String eventTitle);

    @Query("SELECT e FROM EventRegister e WHERE e.eventTitle = (SELECT ev.eventTitle FROM EventRegister ev ORDER BY ev.id DESC LIMIT 1)")
List<EventRegister> findLatestEventRegistrations();

}
