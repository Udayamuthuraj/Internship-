package com.example.demo.dto.admin;

public class AdminForgotPasswordRequest {

    private String email;

    // Constructors
    public AdminForgotPasswordRequest() {
    }

    public AdminForgotPasswordRequest(String email) {
        this.email = email;
    }

    // Getter and Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
