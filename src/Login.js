import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Importar Axios

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Navegar a la página de registro
  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Navegar a la página de recuperación de contraseña
  const handlePasswordRecoveryClick = () => {
    navigate('/password-recovery');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.status === 200) {
        console.log('Inicio de sesión exitoso', response.data);
        // Redirigir a la página de dashboard después de inicio de sesión exitoso
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        // Mostrar mensaje de error específico del backend
        setError(error.response.data.message || 'Error en el inicio de sesión');
      } else {
        setError('Error en el inicio de sesión');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Bienvenid@</h2>
        <h3>Sistema de consulta de trayectorias a partir de datos móviles anonimizados</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error */}
        <form onSubmit={handleSubmit}>
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
          <button className="login-button" type="submit">Iniciar Sesión</button>
        </form>
        <div className="button-group">
          <button className="link-button" onClick={handleRegisterClick}>Registrarse</button>
          <button className="link-button" onClick={handlePasswordRecoveryClick}>Recuperar Contraseña</button>
        </div>
      </div>
    </div>
  );
}

export default Login;




