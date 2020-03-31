import React, { useContext } from 'react';

import Card from './UI/Card';
import './Auth.css';
import AuthContextProvider, { AuthContext } from '.././context/auth-context';

const Auth = props => {
  const context = useContext(AuthContext);

  const loginHandler = () => {
    context.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;
