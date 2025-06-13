package com.example.demo.repository.Eventrepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Eventmodel.Eventmodel; // Correct import

@Repository
public interface EventRepository extends JpaRepository<Eventmodel, Long> {
}
