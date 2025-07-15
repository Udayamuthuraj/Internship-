package com.example.demo.repository.admin;

import com.example.demo.model.admin.GalleryMedia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GalleryMediaRepository extends JpaRepository<GalleryMedia, Long> {

    // ✅ Basic CRUD handled by JpaRepository

    // ✅ Paginated fetch
    Page<GalleryMedia> findAll(Pageable pageable);

    // ✅ Find by category
    List<GalleryMedia> findByCategory(String category);

    // ✅ Search by filename
    List<GalleryMedia> findByFilenameContainingIgnoreCase(String keyword);

    // ✅ Filter by uploader
    List<GalleryMedia> findByUploadedBy(String uploadedBy);
    List<GalleryMedia> findByTitleContainingIgnoreCase(String keyword);


    // ✅ Filter by upload date range
    List<GalleryMedia> findByUploadDateBetween(LocalDateTime start, LocalDateTime end);

    // ✅ Filter by updated date range
    List<GalleryMedia> findByUpdatedAtBetween(LocalDateTime start, LocalDateTime end);

    // ✅ Sort by most recent uploads
    List<GalleryMedia> findAllByOrderByUploadDateDesc();

    // ✅ Sort by most recent updates
    List<GalleryMedia> findAllByOrderByUpdatedAtDesc();
}
