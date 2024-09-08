/*import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div className="login-background">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <form>
          <input 
            type="email" 
            className="login-input" 
            placeholder="Correo Electrónico (ej. usuario@dominio.com)" 
            required 
          />
          <input 
            type="password" 
            className="login-input" 
            placeholder="Contraseña" 
            required 
          />
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
        <div className="login-options">
          <button className="register-button">Registrarse</button>
          <button className="recover-button">Recuperar Contraseña</button>
        </div>
      </div>
    </div>
  );
}

export default App;
*/
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para la página de registro */}
        <Route path="/register" element={<Register />} />

        {/* Redirigir a /login si la ruta no coincide */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;


