import axios from "axios";

const BASE_URL = "http://localhost:8080/api/alumni";

// ✅ Register Alumni
export const registerAlumni = async (alumniData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, alumniData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed.";
  }
};

// ✅ Check if Email Exists
export const checkAlumniEmailExists = async (email) => {
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
export const sendAlumniOtp = async (email) => {
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
export const verifyAlumniOtp = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/email/verify-otp`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "OTP verification failed.";
  }
};

// ✅ Alumni Login
export const loginAlumni = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed.";
  }
};

// ✅ Forgot Password - Send OTP
export const forgotAlumniPassword = async (email) => {
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
export const resetAlumniPassword = async (resetData) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/reset-password`, resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Password reset failed.";
  }
};

// ✅ Optional: Logout Helper
export const logoutAlumni = () => {
  sessionStorage.removeItem("token");
  window.location.href = "/alumni/login";
};
