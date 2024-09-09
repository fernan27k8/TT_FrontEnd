import React from 'react';
import './Login.css'; // Puedes usar el mismo CSS de Login para mantener el diseño consistente
import { useNavigate } from 'react-router-dom';

function PasswordRecovery() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Recuperar Contraseña</h2>
        <input type="email" placeholder="Correo Electrónico (ej. ejemplo@correo.com)" />
        <button className="login-button">Enviar Correo de Recuperación</button>
        <div className="button-group">
          <button className="link-button" onClick={handleLoginClick}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecovery;

