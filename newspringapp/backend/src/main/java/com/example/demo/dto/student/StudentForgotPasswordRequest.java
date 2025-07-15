package com.example.demo.dto.student;

public class StudentForgotPasswordRequest {

    private String email;

    // Constructors
    public StudentForgotPasswordRequest() {
    }

    public StudentForgotPasswordRequest(String email) {
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
