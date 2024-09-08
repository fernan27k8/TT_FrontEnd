import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <input type="email" placeholder="Correo Electrónico (ej. ejemplo@correo.com)" />
        <input type="password" placeholder="Contraseña" />
        <button className="login-button">Iniciar Sesión</button>
        <div className="button-group">
          <button className="link-button" onClick={handleRegisterClick}>Registrarse</button>
          <button className="link-button">Recuperar Contraseña</button>
        </div>
      </div>
    </div>
  );
}

export default Login;

