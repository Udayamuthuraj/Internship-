package com.example.demo.dto.alumni;

import lombok.*;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniPostDTO {
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("post_text")
    private String postText;

    @JsonProperty("post_photo_url")
    private String postPhotoUrl;
}

