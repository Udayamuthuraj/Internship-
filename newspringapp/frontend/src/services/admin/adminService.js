import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

// ✅ Register Admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, adminData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw new Error(
      error?.response?.data || error.message || "Registration failed."
    );
  }
};

// ✅ Check if Email Exists
export const checkAdminEmailExists = async (email) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/email-exists`, {
      params: { email: email.trim().toLowerCase() },
    });
    return response.data === true;
  } catch (error) {
    console.error("Email Check Error:", error);
    throw new Error(
      error?.response?.data || error.message || "Email check failed."
    );
  }
};

// ✅ Send OTP to Admin Email
export const sendAdminOtp = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/email/send-otp`, null, {
      params: { email: email.trim().toLowerCase() },
    });
    return response.data;
  } catch (error) {
    console.error("OTP Send Error:", error);
    throw new Error(
      error?.response?.data || error.message || "OTP sending failed."
    );
  }
};

// ✅ Verify OTP
// ✅ Verify Admin OTP
export const verifyAdminOtp = async ({ email, otp }) => {
  try {
    const response = await axios.post(`${BASE_URL}/email/verify-otp`, {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    });
    return response.data; // expected: "✅ OTP verified successfully."
  } catch (error) {
    console.error("OTP Verification Error:", error);

    const message =
      error?.response?.data ||
      error?.message ||
      "OTP verification failed. Please try again.";

    throw new Error(`❌ ${message}`);
  }
};


// ✅ Admin Login
export const loginAdmin = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: loginData.email.trim().toLowerCase(),
      password: loginData.password,
    });

    const { token, name, email, profileImageUrl } = response.data || {};
    const admin = { name, email, profileImageUrl };

    sessionStorage.setItem("admin", JSON.stringify(admin));
    sessionStorage.setItem("adminToken", token);

    return { admin, token };
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error(
      error?.response?.data || error.message || "Login failed."
    );
  }
};

// ✅ Forgot Password - Send OTP
export const forgotAdminPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/forgot-password`, null, {
      params: { email: email.trim().toLowerCase() },
    });
    return response.data;
  } catch (error) {
    console.error("Forgot Password OTP Error:", error);
    throw new Error(
      error?.response?.data || error.message || "Failed to send reset OTP."
    );
  }
};

// ✅ Reset Password
export const resetAdminPassword = async (resetData) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/reset-password`, {
      email: resetData.email.trim().toLowerCase(),
      otp: resetData.otp.trim(),
      newPassword: resetData.newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw new Error(
      error?.response?.data || error.message || "Password reset failed."
    );
  }
};

// ✅ Logout Admin
export const logoutAdmin = () => {
  sessionStorage.removeItem("admin");
  sessionStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
};
