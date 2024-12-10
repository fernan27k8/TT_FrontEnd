import React, { useState } from 'react';
import '../styles/Login.css';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const validatePassword = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };
};

function Register() {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setPasswordCriteria(validatePassword(value));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginClick = () => {
    history.push('/');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    setError('');
    setSuccessMessage('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(email)) {
      setError('El correo no es válido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        setSuccessMessage('Registro exitoso. Redirigiendo...');
        setTimeout(() => history.push('/verify'), 2000);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Error en el registro');
      } else {
        setError('Error en el registro');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Registrarse</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Nombre Completo"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
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
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button className="login-button" type="submit">Registrarse</button>
        </form>
        <div className="button-group">
          <button className="link-button" onClick={handleLoginClick}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;



