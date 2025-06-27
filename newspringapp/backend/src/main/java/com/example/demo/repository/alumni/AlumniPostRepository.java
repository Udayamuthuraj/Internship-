package com.example.demo.repository.alumni;

import com.example.demo.model.alumni.AlumniPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlumniPostRepository extends JpaRepository<AlumniPost, Long> {
    List<AlumniPost> findByUserId(Long userId);
}
