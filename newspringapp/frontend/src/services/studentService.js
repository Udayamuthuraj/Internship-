import axios from "axios";

const BASE_URL = "http://localhost:8080/api/student";

// ✅ Register Student
export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed.";
  }
};

// ✅ Check if Email Exists
export const checkStudentEmailExists = async (email) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/email-exists`, {
      params: { email },
    });
    return response.data === true;
  } catch (error) {
    throw error.response?.data || "Email check failed.";
  }
};

// ✅ Send OTP to Email
export const sendStudentOtp = async (email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/email/send-otp?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "OTP sending failed.";
  }
};

// ✅ Verify OTP
export const verifyStudentOtp = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/email/verify-otp`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "OTP verification failed.";
  }
};

// ✅ Student Login
export const loginStudent = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed.";
  }
};

// ✅ Forgot Password - Send OTP
export const forgotStudentPassword = async (email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/password/forgot-password?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to send reset OTP.";
  }
};

// ✅ Reset Password
export const resetStudentPassword = async (resetData) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/reset-password`, resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Password reset failed.";
  }
};

// ✅ Optional: Logout Helper
export const logoutStudent = () => {
  sessionStorage.removeItem("token");
  window.location.href = "/student/login";
};
