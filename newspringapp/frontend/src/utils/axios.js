// src/utils/axios.js

import axios from "axios";

// ✅ Create a reusable Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 🔁 Change this if your backend URL changes
  withCredentials: true, // 🔐 Allow sending cookies if needed (Spring Security)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token from sessionStorage (or localStorage if preferred)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // Or use localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Optional global error handling (for toast or redirect)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Automatically log out on 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Please log in again.");
      // Optionally redirect or clear session here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
