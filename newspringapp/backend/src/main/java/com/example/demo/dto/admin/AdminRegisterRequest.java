package com.example.demo.dto.admin;

public class AdminRegisterRequest {

    private String name;
    private String email;
    private String password;
    private String adminCode;
    private String otp;

    // Constructors
    public AdminRegisterRequest() {
    }

    public AdminRegisterRequest(String name, String email, String password, String adminCode, String otp) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.adminCode = adminCode;
        this.otp = otp;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAdminCode() {
        return adminCode;
    }

    public void setAdminCode(String adminCode) {
        this.adminCode = adminCode;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
