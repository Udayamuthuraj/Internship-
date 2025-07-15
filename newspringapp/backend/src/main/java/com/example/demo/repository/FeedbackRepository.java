package com.example.demo.repository;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // ✅ Custom query to update admin reply and isReplied by feedback ID
    @Transactional
    @Modifying
    @Query("UPDATE Feedback f SET f.adminReply = :reply, f.isReplied = true WHERE f.id = :id")
    int updateAdminReplyById(@Param("id") Long id, @Param("reply") String reply);
}
