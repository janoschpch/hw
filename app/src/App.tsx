import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/loginpage/LoginPage';
import './App.css';
import RegisterPage from './pages/registerpage/RegisterPage';
import DashboardPage from './pages/dashboardpage/DashboardPage';
import { useUser, UserProvider } from './hooks/useUser';

function App() {
  const { token, setToken } = useUser();

  if (!token) {
    if (window.location.pathname != "/" && window.location.pathname != "/register") {
      window.location.href = "/";
    }
    return (
      <div className="App">
        <BrowserRouter>
          <Routes >
            <Route path="/" element={<LoginPage setToken={(token: string) => {
              setToken(token);
            }} />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  } else {
    if (window.location.pathname == "/") {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
