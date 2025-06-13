package com.example.demo.repository.Eventrepository;

import com.example.demo.model.Eventmodel.EventRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Eventviewrepository extends JpaRepository<EventRegister, Long> {
}
