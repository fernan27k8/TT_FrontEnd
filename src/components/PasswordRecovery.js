import React, { useState } from 'react';
import '../styles/Login.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Para realizar la solicitud al backend

function PasswordRecovery() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Mensaje de éxito o error
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Enviar solicitud al backend
      const response = await axios.post('http://localhost:5000/api/auth/password-recovery', { email });

      if (response.status === 200) {
        setMessage('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        setError(''); // Limpiar cualquier mensaje de error
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al enviar el correo de recuperación');
      } else {
        setError('Error al enviar el correo de recuperación');
      }
      setMessage(''); // Limpiar el mensaje de éxito
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Recuperar Contraseña</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>} {/* Mensaje de éxito */}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensaje de error */}
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Correo Electrónico (ej. ejemplo@correo.com)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <button className="login-button" type="submit">Enviar Correo de Recuperación</button>
        </form>
        <div className="button-group">
          <button className="link-button" onClick={handleLoginClick}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecovery;

