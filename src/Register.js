import React from 'react';
import './Login.css'; // Puedes usar el mismo CSS de Login para mantener el diseño consistente
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Registrarse</h2>
        <input type="text" placeholder="Nombre Completo" />
        <input type="email" placeholder="Correo Electrónico (ej. ejemplo@correo.com)" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Confirmar Contraseña" />
        <button className="login-button">Registrarse</button>
        <div className="button-group">
          <button className="link-button" onClick={handleLoginClick}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default Register;



