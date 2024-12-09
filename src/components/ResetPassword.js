import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Función para validar la contraseña
const validatePassword = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };
};

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [message, setMessage] = useState('');
  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordCriteria(validatePassword(newPassword));  // Validar cada vez que se cambia la contraseña
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setMessage('La contraseña no cumple con los requisitos.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      if (response.status === 200) {
        history.push('/'); // Redirige al login después de restablecer
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
          <div className='password-input-container'>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Introduce una nueva contraseña"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          <div className="password-indicators">
            <p style={{ color: passwordCriteria.length ? 'green' : 'red' }}>
              - Mínimo 8 caracteres
            </p>
            <p style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>
              - Al menos una letra mayúscula
            </p>
            <p style={{ color: passwordCriteria.lowercase ? 'green' : 'red' }}>
              - Al menos una letra minúscula
            </p>
            <p style={{ color: passwordCriteria.number ? 'green' : 'red' }}>
              - Al menos un número
            </p>
            <p style={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>
              - Al menos un carácter especial (@$!%*?&)
            </p>
          </div>
          <button className="login-button" type="submit">Restablecer</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

