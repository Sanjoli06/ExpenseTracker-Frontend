import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ make sure you have react-toastify installed

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ✅ Check token validity
  const isTokenExpired = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (err) {
      return true; // invalid or corrupted token
    }
  };

  if (!token || isTokenExpired()) {
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
