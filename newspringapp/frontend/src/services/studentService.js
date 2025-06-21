import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/student";

// 🔐 Custom Axios instance
const axiosInstance = axios.create();

// 🔁 Auto logout on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or unauthorized. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("studentEmail");
      window.location.href = "/student/login";
    }
    return Promise.reject(error);
  }
);

// 🔐 Add Authorization Header Automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Register Student (no token needed)
export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, studentData);
    return response.data;
  } catch (error) {
    console.error("Student Registration API Error:", error.response || error);
    throw error.response?.data?.message || "Server error. Try again later.";
  }
};

// 🔹 Login Student (no token needed)
export const loginStudent = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    console.log("✅ Full Login API Response:", response.data); // 👈 log here
    return response.data;
  } catch (error) {
    console.error("Student Login API Error:", error.response || error);
    throw error.response?.data || "Invalid email or password";
  }
};

// 🔹 Check if Email Already Exists (no token needed)
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-email?email=${email}`);
    return response.data.exists;
  } catch (error) {
    console.error("Email check error:", error.response || error);
    throw error.response?.data || "Email check failed";
  }
};

// 🔹 Get student profile info (name, email)
export const getStudentProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error("Fetch student profile error:", error.response || error);
    throw error.response?.data || "Failed to fetch profile";
  }
};

// 🔹 Get full editable student details (headline, about, etc.)
export const getStudentDetails = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/details`);
    return response.data;
  } catch (error) {
    console.error("Fetch student details error:", error.response || error);
    throw error.response?.data || "Failed to fetch details";
  }
};

// 🔹 Update student profile details
export const updateStudentDetails = async (updatedData) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/details`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update student details error:", error.response || error);
    throw error.response?.data || "Failed to update profile";
  }
};

