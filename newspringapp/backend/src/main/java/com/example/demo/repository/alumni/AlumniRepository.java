package com.example.demo.repository.alumni;

import com.example.demo.model.alumni.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    boolean existsByUemail(String uemail);
    Optional<Alumni> findByUemail(String uemail);
    List<Alumni> findByUnameContainingIgnoreCase(String uname);
}

