package com.example.demo.service.alumni;

import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomAlumniDetailsService implements UserDetailsService {

    @Autowired
    private AlumniRepository alumniRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Alumni alumni = alumniRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Alumni not found with email: " + email));

        return new User(alumni.getEmail(), alumni.getPassword(), Collections.emptyList());
    }
}
