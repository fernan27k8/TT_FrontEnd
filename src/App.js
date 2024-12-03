import React from "react";
import { Route, Switch, BrowserRouter } from 'react-router-dom';  // Asegúrate de importar BrowserRouter
import Login from './components/Login';
import Register from './components/Register';
import PasswordRecovery from './components/PasswordRecovery';
import ResetPassword from './components/ResetPassword';
import Dashboard from './pages/Dashboard';
import Consult from "./components/Consult";
import VerifyEmail from "./components/verifyEmail";

const App = () => {
  return (
    <BrowserRouter> {}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/verify" component={VerifyEmail} />
        <Route path="/password-recovery" component={PasswordRecovery} />
        <Route exact path="/" component={Login} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/consult" component={Consult} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

