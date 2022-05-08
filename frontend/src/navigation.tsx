import { ReactElement, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './api';

export const NavBar = (): ReactElement => {
  const userCtx = useContext(UserContext);
  if (userCtx.user) {
    return <nav>
      <NavLink to="/">Topics</NavLink>
      <div>Welcome, {userCtx.user.name}!</div>
      <NavLink to="/post">Create a post</NavLink>
      <a onClick={() => {
        userCtx.setUser(null);
        localStorage.removeItem('userDetails');
      }}>Log out</a>
    </nav>;
  } else {
    return <nav>
      <NavLink to="/">Topics</NavLink>
      <NavLink to="/login">Log in</NavLink>
      <NavLink to="/register">Create account</NavLink>
    </nav>;
  }
}