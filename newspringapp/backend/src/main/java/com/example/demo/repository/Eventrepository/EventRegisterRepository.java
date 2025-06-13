package com.example.demo.repository.Eventrepository;

import com.example.demo.model.Eventmodel.EventRegister;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegisterRepository extends JpaRepository<EventRegister, Long> {
}
