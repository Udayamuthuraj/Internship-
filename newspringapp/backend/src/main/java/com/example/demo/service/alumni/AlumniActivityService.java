package com.example.demo.service.alumni;

import com.example.demo.model.alumni.AlumniActivity;
import com.example.demo.repository.alumni.AlumniActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlumniActivityService {

    @Autowired
    private AlumniActivityRepository repository;

    public List<AlumniActivity> getActivitiesByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public AlumniActivity saveActivity(AlumniActivity activity) {
        return repository.save(activity);
    }
}
