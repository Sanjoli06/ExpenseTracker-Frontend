import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/Common/Navbar";
import ViewAllEntriesPage from "./pages/Entries/ViewAllEntriesPage";
import NotFoundPage from "../src/pages/NotFound/NotFoundPage"; // ✅ make sure you created this

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      {/* Navbar will auto-hide on /login or /signup */}
      <Navbar />

      <Routes>
        {/* Auth pages — redirect if already logged in */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" /> : <AuthPage />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/home" /> : <AuthPage />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/home" /> : <AuthPage />}
        />

        {/* Protected pages */}
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

        {/* ✅ Not Found route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
