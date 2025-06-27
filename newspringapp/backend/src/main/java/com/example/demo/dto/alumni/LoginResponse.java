package com.example.demo.dto.alumni;

public class LoginResponse {
    private String token;
    private Long uid;
    private String username;

    public LoginResponse(String token, Long uid, String username) {
        this.token = token;
        this.uid = uid;
        this.username = username;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return uid; }
    public void setUserId(Long uid) { this.uid = uid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}