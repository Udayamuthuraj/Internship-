package com.example.demo.dto.admin;

public class AdminVerifyOtpRequest {

    private String email;
    private String otp;

    // Constructors
    public AdminVerifyOtpRequest() {
    }

    public AdminVerifyOtpRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
