package com.example.demo.dto.admin;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class AdminProfileUpdateRequest {

    // Used to identify the currently logged-in admin
    private String email;

    // Optional: New name if admin wants to change their display name
    private String newName;

    // Optional: New profile image to upload
    private MultipartFile profileImage;
}
