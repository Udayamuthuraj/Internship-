package com.example.demo.model.alumni;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long connection_id;

    private LocalDateTime requested_at;
    private LocalDateTime accepted_at;
    @Column(name = "user_id1")
    private Long userId1;
    @Column(name = "user_id2")
    private Long userId2;
    private String status;
}
