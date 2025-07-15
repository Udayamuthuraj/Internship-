package com.example.demo.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminEmailUpdateRequest {

    private String currentEmail; // The currently registered email of the admin
    private String newEmail;     // The new email to which OTP should be sent
}
