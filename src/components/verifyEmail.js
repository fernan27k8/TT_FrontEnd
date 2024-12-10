import React, { useState } from 'react';
import '../styles/Login.css'; 
import { useHistory } from 'react-router-dom';
import axios from 'axios';
//import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState(''); // Estado para el código
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el código no esté vacío
    if (!verificationCode) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    try {
      console.log('Enviando al backend:', { verificationCode }); // Log para depuración

      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-email',
        { verificationCode }, // Solo envía el código
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Respuesta del backend:', response.data); // Log para depuración

      if (response.status === 200) {
        setSuccessMessage('Correo verificado con éxito. Redirigiendo a inicio de sesión...');
        setTimeout(() => {
          history.push('/'); // Redirige a la página de inicio de sesión
        }, 2000);
      }
    } catch (error) {
      console.error('Error al verificar:', error.response?.data || error.message); // Log del error
      setError('Código de verificación incorrecto o expirado');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Verificación de Correo</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="verificationCode"
            placeholder="Código de verificación"
            value={verificationCode}
            onChange={handleChange}
          />
          <button className="login-button" type="submit">Verificar</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
