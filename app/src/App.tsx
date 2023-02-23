import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/loginpage/LoginPage';
import './App.css';
import RegisterPage from './pages/registerpage/RegisterPage';
import DashboardPage from './pages/dashboardpage/DashboardPage';
import { useUser, UserProvider } from './hooks/useUser';
import SettingsPage from './pages/settingspage/SettingsPage';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import SharePage from './pages/sharepage/SharePage';

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
            <Route path="/share/:token" element={<SharePage />} />
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
        <NotificationsProvider>
          <ModalsProvider>
            <BrowserRouter>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path='/settings' element={<SettingsPage />} />
                  <Route path="/share/:token" element={<SharePage />} />
                </Routes>
            </BrowserRouter>
          </ModalsProvider>
        </NotificationsProvider>
    </div>
  );
}

export default App;
