import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/student";

// 🔹 Register API
export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, studentData);
    return response.data;
  } catch (error) {
    console.error("Student Registration API Error:", error.response || error);
    throw error.response?.data?.message || "Server error. Try again later.";
  }
};

// 🔹 Login API
export const loginStudent = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response.data; // Will contain name and email if success
  } catch (error) {
    console.error("Student Login API Error:", error.response || error);
    throw error.response?.data || "Invalid email or password";
  }
};

// 🔹 Check if email is already registered
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-email`, {
      params: { email },
    });
    return response.data; // true or false
  } catch (error) {
    console.error("Email check error:", error);
    return false; // default to false if error
  }
};


