package com.example.demo.dto.alumni;

public class AlumniForgotPasswordRequest {

    private String email;

    // Constructors
    public AlumniForgotPasswordRequest() {
    }

    public AlumniForgotPasswordRequest(String email) {
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
