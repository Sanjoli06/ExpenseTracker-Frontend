import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ ensure react-toastify is installed and imported

const ProtectedRoute = ({ children }) => {
  const [valid, setValid] = useState(null); // null = loading, true = valid, false = invalid
  const token = localStorage.getItem("token");

  // ✅ Helper to check token expiry
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (err) {
      return true; // invalid or corrupted token
    }
  };

  // ✅ Check token validity on mount
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");
      setValid(false);
    } else {
      setValid(true);
    }
  }, [token]);

  // ⏳ While verifying token
  if (valid === null) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  // 🚫 Invalid or expired token → redirect to login
  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → render the protected page
  return children;
};

export default ProtectedRoute;
