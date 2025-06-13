package com.example.demo.controller.Eventcontroller;

import com.example.demo.model.Eventmodel.Eventmodel;
import com.example.demo.service.Eventservice.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
 
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventservice;

    @PostMapping("/upload")
    public Eventmodel uploadEvent(
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
    ) throws Exception {

        Eventmodel event = new Eventmodel();
        event.setTitle(title);
        event.setDate(date);
        event.setTime(time);
        event.setLocation(location);
        event.setOrganizer(organizer);
        event.setDescription(description);

        return eventservice.saveEvent(event, poster, recapMedia, pdf, qrCode);
    }
}
