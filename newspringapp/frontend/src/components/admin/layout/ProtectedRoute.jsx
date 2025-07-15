import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

// Optional: You can implement token expiry check here
const ProtectedRoute = () => {
  const { admin } = useContext(AuthContext);

  if (!admin || !admin.token) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, allow access to nested routes
  return <Outlet />;
};

export default ProtectedRoute;
