import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PasswordRecovery from './components/PasswordRecovery';
import ResetPassword from './components/ResetPassword';
import Dashboard from './pages/Dashboard'; // Página temporal'

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para la página de registro */}
        <Route path="/register" element={<Register />} />

        {/* Ruta para la página de recuperacion de contraseñá */}
        <Route path="/password-recovery" element={<PasswordRecovery />} />

        {/* Redirigir a /login si la ruta no coincide */}
        <Route path="/" element={<Login />} />
        
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Página después de inicio de sesión */}
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;


