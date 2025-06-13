package com.example.demo.service.Eventservice;

import com.example.demo.model.Eventmodel.EventRegister;
import com.example.demo.repository.Eventrepository.EventRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventRegisterService {

    @Autowired
    private EventRegisterRepository repository;

    public EventRegister save(EventRegister register) {
        return repository.save(register);
    }
}
