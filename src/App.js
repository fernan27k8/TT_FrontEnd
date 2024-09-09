import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import PasswordRecovery from './PasswordRecovery';

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
      </Routes>
    </Router>
  );
}

export default App;


