import { FormEvent, ReactElement, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createAccount, logIn, UserContext } from './api';

export const LoginPage = (): ReactElement => {
  const userCtx = useContext(UserContext);
  if (userCtx.user) {
    // Already logged in
    return <Navigate to="/" />;
  }

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const details = await logIn(name, password);
    if (details) {
      userCtx.setUser(details);
      localStorage.setItem('userDetails', JSON.stringify(details));
    }
  }

  return <section>
    <h1>Log in</h1>
    <form onSubmit={tryLogin}>
      <label>
        Username:
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <input type="submit" value="Log in!" />
    </form>
  </section>;
}

export const RegisterPage = (): ReactElement => {
  const userCtx = useContext(UserContext);
  if (userCtx.user) {
    // Already logged in
    return <Navigate to="/" />;
  }

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const tryRegister = async (event: FormEvent) => {
    event.preventDefault();
    const details = await createAccount(name, password);
    if (details) {
      userCtx.setUser(details);
      localStorage.setItem('userDetails', JSON.stringify(details));
    }
  }

  return <section>
    <h1>Create an account</h1>
    <form onSubmit={tryRegister}>
      <label>
        Username:
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <input type="submit" value="Register!" />
    </form>
  </section>;
}