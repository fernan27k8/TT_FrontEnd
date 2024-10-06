import React, { useState } from 'react';
import '../styles/Login.css'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Importar Axios

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Para mostrar mensaje de éxito

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    // Limpiar mensaje de éxito y error antes de la validación
    setError('');
    setSuccessMessage('');

    // Validar que todos los campos estén completos
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar formato de correo electrónico
    if (!validateEmail(email)) {
      setError('El correo no es válido');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    console.log("Datos enviados:", { fullName, email, password, confirmPassword });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        console.log('Registro exitoso', response.data);
        setSuccessMessage('Registro exitoso. Redirigiendo a la página de inicio de sesión...');
        setTimeout(() => navigate('/'), 2000); // Redirigir después de 2 segundos
      }
    } catch (error) {
      if (error.response) {
        // Mostrar mensaje de error específico del backend
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
            placeholder="Correo Electrónico (ej. ejemplo@correo.com)"
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
          <button className="link-button" onClick={handleLoginClick}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default Register;


