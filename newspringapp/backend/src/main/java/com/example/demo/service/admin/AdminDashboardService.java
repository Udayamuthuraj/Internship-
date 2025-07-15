package com.example.demo.service.admin;

import com.example.demo.dto.admin.AdminSummaryDTO;
import com.example.demo.dto.admin.DashboardStatsDto;
import com.example.demo.dto.admin.DepartmentStatsDto;
import com.example.demo.dto.common.DeleteRequest;
import com.example.demo.model.admin.Admin;
import com.example.demo.model.alumni.Alumni;
import com.example.demo.model.student.Student;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.admin.*;
import com.example.demo.repository.alumni.AlumniRepository;
import com.example.demo.repository.eventrepository.EventPageRepository;
import com.example.demo.repository.student.StudentRepository;
import com.example.demo.utils.EmailService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AlumniRepository alumniRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final FeedbackRepository feedbackRepository;
    private final EventPageRepository eventPageRepository;
    private final GalleryMediaRepository galleryMediaRepository;
    private final BroadcastEmailRepository broadcastEmailRepository;
    private final MemberRepository memberRepository;
    private final VideoRepository videoRepository;
    private final EmailService emailService;

    /**
     * Returns overall statistics for admin dashboard.
     */
    public DashboardStatsDto getDashboardStats() {
        return DashboardStatsDto.builder()
                .totalAlumni(alumniRepository.count())
                .totalStudents(studentRepository.count())
                .totalAdmins(adminRepository.count())
                .totalFeedback(feedbackRepository.count())
                .totalEvents(eventPageRepository.count())
                .totalGallery(galleryMediaRepository.count())
                .totalBroadcasts(broadcastEmailRepository.count())
                .totalVideos(videoRepository.count())
                .totalMembers(memberRepository.count())
                .build();
    }

    /**
     * Returns department-wise student and alumni statistics.
     */
    public List<DepartmentStatsDto> getDepartmentStats() {
        List<Object[]> studentCounts = studentRepository.countByDepartmentGrouped();
        List<Object[]> alumniCounts = alumniRepository.countByDepartmentGrouped();

        Map<String, Long> studentMap = new HashMap<>();
        Map<String, Long> alumniMap = new HashMap<>();

        for (Object[] row : studentCounts) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            studentMap.put(dept, count);
        }

        for (Object[] row : alumniCounts) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            alumniMap.put(dept, count);
        }

        Set<String> allDepartments = new HashSet<>(studentMap.keySet());
        allDepartments.addAll(alumniMap.keySet());

        List<DepartmentStatsDto> result = new ArrayList<>();
        for (String dept : allDepartments) {
            result.add(DepartmentStatsDto.builder()
                    .department(dept)
                    .studentCount(studentMap.getOrDefault(dept, 0L))
                    .alumniCount(alumniMap.getOrDefault(dept, 0L))
                    .build());
        }

        return result;
    }

    /**
     * Delete a student by ID and send email notification.
     */
    public void deleteStudentById(Long id, DeleteRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
        studentRepository.deleteById(id);

        try {
            emailService.sendDeletionEmail(
                    request.getEmail(),
                    request.getName(),
                    "Student",
                    request.getReason()
            );
        } catch (MessagingException e) {
            log.error("❌ Failed to send deletion email to student {}: {}", request.getEmail(), e.getMessage());
        }
    }

    /**
     * Delete an alumni by ID and send email notification.
     */
    public void deleteAlumniById(Long id, DeleteRequest request) {
        Alumni alumni = alumniRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alumni not found with ID: " + id));
        alumniRepository.deleteById(id);

        try {
            emailService.sendDeletionEmail(
                    request.getEmail(),
                    request.getName(),
                    "Alumni",
                    request.getReason()
            );
        } catch (MessagingException e) {
            log.error("❌ Failed to send deletion email to alumni {}: {}", request.getEmail(), e.getMessage());
        }
    }

    /**
     * Delete an admin by ID and send email notification.
     */
    public void deleteAdminById(Long id, DeleteRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + id));
        adminRepository.deleteById(id);

        try {
            emailService.sendDeletionEmail(
                    request.getEmail(),
                    request.getName(),
                    "Admin",
                    request.getReason()
            );
        } catch (MessagingException e) {
            log.error("❌ Failed to send deletion email to admin {}: {}", request.getEmail(), e.getMessage());
        }
    }

    /**
     * Get all admin summaries (id, name, email, profileImageUrl).
     */
    public List<AdminSummaryDTO> getAllAdminSummaries() {
        return adminRepository.findAllAdminSummaries();
    }
}
