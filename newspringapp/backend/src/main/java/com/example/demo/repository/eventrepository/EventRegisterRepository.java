package com.example.demo.repository.eventrepository;

import com.example.demo.model.eventmodel.EventRegister;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegisterRepository extends JpaRepository<EventRegister, Long> {
}

