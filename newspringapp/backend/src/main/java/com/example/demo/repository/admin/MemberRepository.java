package com.example.demo.repository.admin;

import com.example.demo.model.admin.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    /**
     * ✅ Check if a member exists by email.
     * Useful to avoid duplicates.
     */
    boolean existsByEmail(String email);

    /**
     * ✅ Find a member by their email address.
     */
    Optional<Member> findByEmail(String email);

    /**
     * 🔍 Non-paginated search: Find members by name or department (case-insensitive).
     * (Optional - used only if you ever need backend-side filtering in future)
     */
    List<Member> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(String name, String department);

    /**
     * ⏳ Optional: Uncomment if you use joinDate and want to order by it.
     */
    // List<Member> findAllByOrderByJoinDateDesc();
}
