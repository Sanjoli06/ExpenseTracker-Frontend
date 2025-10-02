import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage/>} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
