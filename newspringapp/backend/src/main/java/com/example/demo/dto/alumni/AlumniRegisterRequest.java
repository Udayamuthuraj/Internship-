package com.example.demo.dto.alumni;

public class AlumniRegisterRequest {

    private String name;
    private String email;
    private String password;
    private String department;
    private String batch;
    private String otp;

    // Constructors
    public AlumniRegisterRequest() {
    }

    public AlumniRegisterRequest(String name, String email, String password, String department, String batch, String otp) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.batch = batch;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
