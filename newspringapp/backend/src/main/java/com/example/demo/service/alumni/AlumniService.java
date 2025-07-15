package com.example.demo.service.alumni;

import com.example.demo.dto.alumni.AlumniSummaryDTO;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.repository.alumni.AlumniRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlumniService {

    private final AlumniRepository alumniRepository;

    /**
     * Fetch all alumni entries.
     * @return List of Alumni entities
     */
    public List<Alumni> getAllAlumni() {
        return alumniRepository.findAll();
    }

    /**
     * Fetch all alumni as summary DTOs for listing (name, email, dept, batch).
     * @return List of AlumniSummaryDTO
     */
    public List<AlumniSummaryDTO> getAllAlumniSummaries() {
        return alumniRepository.findAllAlumniSummaries();
    }

    /**
     * Filter alumni by batch.
     */
    public List<Alumni> getAlumniByBatch(String batch) {
        return alumniRepository.findByBatch(batch);
    }

    /**
     * Filter alumni by department.
     */
    public List<Alumni> getAlumniByDepartment(String department) {
        return alumniRepository.findByDepartment(department);
    }

    /**
     * Filter alumni by batch and department.
     */
    public List<Alumni> getAlumniByBatchAndDepartment(String batch, String department) {
        return alumniRepository.findByBatchAndDepartment(batch, department);
    }

    /**
     * Delete alumni by ID.
     */
    public void deleteAlumniById(Long id) {
        if (alumniRepository.existsById(id)) {
            alumniRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Alumni with ID " + id + " not found.");
        }
    }
}
