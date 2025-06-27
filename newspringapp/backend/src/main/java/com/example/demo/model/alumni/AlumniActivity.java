package com.example.demo.model.alumni;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activity_id;

    @Column(name = "user_id")
    private Long userId;
    private String activity_type;
    private String activity_details;
    private LocalDateTime created_at;
}
