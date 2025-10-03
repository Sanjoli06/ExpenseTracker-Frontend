import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/Common/Navbar";


function App() {
  return (
    <>
      {/* Navbar will auto-hide on /login or /signup */}
      <Navbar/>

      <Routes>
        {/* Auth page */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        {/* Protected pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        {/* You can add /summary, /stats, /profile, /forgot-password routes here */}
      </Routes>
    </>
  );
}

export default App;
