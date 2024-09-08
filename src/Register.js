import React from 'react';
import './Register.css';

function Register() {
  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Registro</h2>
        <input type="text" placeholder="Nombre" />
        <input type="email" placeholder="Correo Electrónico" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Confirmar Contraseña" />
        <button className="register-button">Registrarse</button>
      </div>
    </div>
  );
}

export default Register;

