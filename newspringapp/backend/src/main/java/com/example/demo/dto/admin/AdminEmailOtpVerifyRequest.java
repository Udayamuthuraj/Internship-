package com.example.demo.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminEmailOtpVerifyRequest {

    private String currentEmail;  // The admin's existing email
    private String newEmail;      // The new email address to verify
    private String otp;           // The OTP sent to the new email for verification
}
