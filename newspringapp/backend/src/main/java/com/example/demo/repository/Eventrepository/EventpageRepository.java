package com.example.demo.repository.Eventrepository;

import com.example.demo.model.Eventmodel.Eventmodel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventpageRepository extends JpaRepository<Eventmodel, Long> {
    Optional<Eventmodel> findByTitle(String title);
}