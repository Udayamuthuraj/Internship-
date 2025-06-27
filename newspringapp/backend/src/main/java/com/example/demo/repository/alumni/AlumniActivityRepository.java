package com.example.demo.repository.alumni;

import com.example.demo.model.alumni.AlumniActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlumniActivityRepository extends JpaRepository<AlumniActivity, Long> {
    List<AlumniActivity> findByUserId(Long userId);
}
