package com.example.demo.dto.alumni;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniMessageDTO {
    private Long sender_id;
    private Long receiver_id;
    private String content;
}
