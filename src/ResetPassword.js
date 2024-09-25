import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/'); // Redirige al login después de restablecer
      }
    } catch (error) {
      setMessage(error.response.data.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Restablecer Contraseña</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Introduce una nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">Restablecer</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
