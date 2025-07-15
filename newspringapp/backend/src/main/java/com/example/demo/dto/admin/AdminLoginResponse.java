package com.example.demo.dto.admin;

public class AdminLoginResponse {

    private String token;
    private String name;
    private String email;
    private String profileImageUrl; // ✅ Added field

    // Constructors
    public AdminLoginResponse() {
    }

    public AdminLoginResponse(String token, String name, String email, String profileImageUrl) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.profileImageUrl = profileImageUrl;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

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

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
