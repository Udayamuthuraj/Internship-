package com.example.demo.controller.alumni;

import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniSearchController {

    @Autowired
    private AlumniRepository alumniRepository;

    @GetMapping
    public List<Alumni> searchUsers(@RequestParam("query") String query) {
        return alumniRepository.findByUnameContainingIgnoreCase(query);
    }
}
