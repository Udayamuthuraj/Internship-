package com.example.demo.service.Eventservice;

import com.example.demo.model.Eventmodel.Eventmodel;
import com.example.demo.repository.Eventrepository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class EventService {

    @Autowired
    private EventRepository repository;

    private final String uploadDir = "uploads/";

    public Eventmodel saveEvent(Eventmodel event,
                                MultipartFile poster,
                                MultipartFile recapMedia,
                                MultipartFile pdf,
                                MultipartFile qrCode) throws IOException {

        // Ensure upload directory exists
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

    // 🔧 Modified this method to use original filename without timestamp
    private String saveFile(MultipartFile file) throws IOException {
        String originalFilename = Paths.get(file.getOriginalFilename()).getFileName().toString(); // Safely get just the filename
        Path path = Paths.get(uploadDir, originalFilename);
        Files.write(path, file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
      return originalFilename;
 // You can return just the filename if preferred
    }
}
