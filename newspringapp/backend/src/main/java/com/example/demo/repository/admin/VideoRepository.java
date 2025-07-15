package com.example.demo.repository.admin;

import com.example.demo.model.admin.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    // ✅ Get all videos
    List<Video> findAll();

    // ✅ Paginated videos
    Page<Video> findAll(Pageable pageable);

    // ✅ Get by category
    List<Video> findByCategory(String category);

    // ✅ Search by filename
    List<Video> findByFilenameContainingIgnoreCase(String keyword);

    // ✅ Search by title
    List<Video> findByTitleContainingIgnoreCase(String keyword);

    // ✅ Uploaded by specific user
    List<Video> findByUploadedBy(String uploadedBy);

    // ✅ Uploaded within date range
    List<Video> findByUploadDateBetween(LocalDateTime start, LocalDateTime end);

    // ✅ Updated within date range
    List<Video> findByUpdatedAtBetween(LocalDateTime start, LocalDateTime end);

    // ✅ Most recent uploads
    List<Video> findAllByOrderByUploadDateDesc();

    // ✅ Most recent updates
    List<Video> findAllByOrderByUpdatedAtDesc();
}
