package com.example.demo.dto.alumni;

public class AlumniLoginResponse {

    private String token;
    private String name;
    private String email;

    // Constructors
    public AlumniLoginResponse() {
    }

    public AlumniLoginResponse(String token, String name, String email) {
        this.token = token;
        this.name = name;
        this.email = email;
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
}
