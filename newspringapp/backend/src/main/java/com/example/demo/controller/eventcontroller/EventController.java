package com.example.demo.controller.eventcontroller;

import com.example.demo.model.eventmodel.EventModel;
import com.example.demo.service.eventservice.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000") // Adjust as needed for deployment
public class EventController {

    @Autowired
    private EventService eventservice;

    // ✅ Upload a new event with optional files
    @PostMapping("/upload")
    public ResponseEntity<EventModel> uploadEvent(
            @RequestParam("title") String title,
            @RequestParam("date") String date,
            @RequestParam("time") String time,
            @RequestParam("location") String location,
            @RequestParam("organizer") String organizer,
            @RequestParam("description") String description,
            @RequestParam("poster") MultipartFile poster,
            @RequestParam(value = "recapMedia", required = false) MultipartFile recapMedia,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf,
            @RequestParam(value = "qrCode", required = false) MultipartFile qrCode
    ) {
        try {
            // Create and populate EventModel object
            EventModel event = new EventModel();
            event.setTitle(title);
            event.setDate(LocalDate.parse(date)); // Converts "yyyy-MM-dd" string to LocalDate
            event.setTime(time);
            event.setLocation(location);
            event.setOrganizer(organizer);
            event.setDescription(description);

            // Save event and return response
            EventModel savedEvent = eventservice.saveEvent(event, poster, recapMedia, pdf, qrCode);
            return ResponseEntity.ok(savedEvent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build(); // Return 400 on failure
        }
    }
}
