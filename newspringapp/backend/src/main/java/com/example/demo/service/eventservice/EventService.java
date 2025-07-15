package com.example.demo.service.eventservice;

import com.example.demo.model.eventmodel.EventModel;
import com.example.demo.repository.eventrepository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository repository;

    private final String uploadDir = "uploads/";

    // 📌 Save new event with optional files
    public EventModel saveEvent(EventModel event,
                                MultipartFile poster,
                                MultipartFile recapMedia,
                                MultipartFile pdf,
                                MultipartFile qrCode) throws IOException {

        // Create upload directory if not exists
        Files.createDirectories(Paths.get(uploadDir));

        if (poster != null && !poster.isEmpty()) {
            String posterPath = saveFile(poster);
            event.setPosterPath(posterPath);
        }
        if (recapMedia != null && !recapMedia.isEmpty()) {
            String recapPath = saveFile(recapMedia);
            event.setRecapMediaPath(recapPath);
        }
        if (pdf != null && !pdf.isEmpty()) {
            String pdfPath = saveFile(pdf);
            event.setPdfPath(pdfPath);
        }
        if (qrCode != null && !qrCode.isEmpty()) {
            String qrPath = saveFile(qrCode);
            event.setQrCodePath(qrPath);
        }

        return repository.save(event);
    }

    // 🔐 Save file and return just filename
    private String saveFile(MultipartFile file) throws IOException {
        String originalFilename = Paths.get(file.getOriginalFilename()).getFileName().toString();
        Path path = Paths.get(uploadDir, originalFilename);
        Files.write(path, file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        return originalFilename;
    }

    // 📤 Get all events
    public List<EventModel> getAllEvents() {
        return repository.findAll();
    }

    // 📅 Get upcoming event titles
    public List<String> getUpcomingEventTitles() {
        return repository.findUpcomingEventTitles(LocalDate.now());
    }

    // 🧭 Search events by title keyword
    public List<EventModel> searchEventsByTitle(String keyword) {
        return repository.findByTitleContainingIgnoreCase(keyword);
    }

    // 📆 Get upcoming events (full info)
    public List<EventModel> getUpcomingEvents() {
        return repository.findByDateAfterOrderByDateAsc(LocalDate.now());
    }

    // 🧲 Get event by ID
    public EventModel getEventById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
