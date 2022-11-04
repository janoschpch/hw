import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginpage/LoginPage';
import './App.css';
import RegisterPage from './pages/registerpage/RegisterPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
