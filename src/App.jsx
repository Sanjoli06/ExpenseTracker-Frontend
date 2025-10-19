import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/Common/Navbar";
import ViewAllEntriesPage from "./pages/Entries/ViewAllEntriesPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import SummaryPage from "./pages/Summary/SummaryPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
 
  // 🧠 Keep token in sync with localStorage (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🪄 Helper to update token on login/logout from Navbar/AuthPage
  const handleTokenChange = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  return (
    <>
      {/* Navbar hides itself on auth pages */}
      <Navbar onLogout={() => handleTokenChange(null)} />

      <Routes>
        {/* Auth Pages */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/home" replace />
            ) : (
              <AuthPage onLogin={handleTokenChange} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/home" replace />
            ) : (
              <AuthPage onLogin={handleTokenChange} />
            )
          }
        />

        {/* Protected Pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-all-entries"
          element={
            <ProtectedRoute>
              <ViewAllEntriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <SummaryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

       <ToastContainer
        position="top-right"              // position (top-right corner)
        autoClose={3000}                  // 3 seconds
        hideProgressBar={false}           // keep progress bar visible
        newestOnTop={true}                // newest notification on top
        closeOnClick                      // allows user to close manually
        pauseOnHover                      // pauses timer when hovered
        draggable                         // allows dragging
        transition={Slide}                // ✅ smooth slide-in animation
        theme="colored"                   // colored theme looks more modern
      />
    </>
  );
}

export default App;
