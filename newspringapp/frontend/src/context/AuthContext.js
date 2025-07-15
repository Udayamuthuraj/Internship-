// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load from sessionStorage on first mount
  useEffect(() => {
    try {
      const storedAdmin = sessionStorage.getItem("admin");
      const storedToken = sessionStorage.getItem("adminToken");

      if (storedAdmin && storedToken) {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load admin from sessionStorage:", error);
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("adminToken");
    }
  }, []);

  // Login function: stores admin info and token
  const login = (adminData, jwtToken) => {
    const fullAdminData = { ...adminData, token: jwtToken };
    setAdmin(fullAdminData);
    setToken(jwtToken);
    sessionStorage.setItem("admin", JSON.stringify(fullAdminData));
    sessionStorage.setItem("adminToken", jwtToken);
  };

  // Update admin info (like name or email) after profile changes
  const updateAdminInfo = (updatedFields) => {
    const updatedAdmin = { ...admin, ...updatedFields };
    setAdmin(updatedAdmin);
    sessionStorage.setItem("admin", JSON.stringify(updatedAdmin));
  };

  // Logout function: clears session data
  const logout = () => {
    setAdmin(null);
    setToken(null);
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");
  };

  // Sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "adminToken" && e.newValue === null) {
        logout();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        login,
        logout,
        loading,
        setLoading,
        updateAdminInfo, // 🔥 exposed to components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
