package com.example.demo.repository.admin;

import com.example.demo.model.admin.BroadcastEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BroadcastEmailRepository extends JpaRepository<BroadcastEmail, Long> {

    /**
     * Fetch all broadcast emails ordered by timestamp descending
     * (latest broadcasts first)
     */
    List<BroadcastEmail> findAllByOrderByTimestampDesc();

    // 🧠 Optional: Add custom queries here as needed in the future
}
