import React, { ReactElement, useLayoutEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './account'
import { UserContext, UserDetails } from './api'
import { NavBar } from './navigation'
import { CreateTopicPage, TopicListPage, TopicPage } from './topic'

import './sakura.css';

const App = (): ReactElement => {
  const [user, setUser] = useState(null as UserDetails);

  // Load user details from local storage to avoid logout on refresh
  useLayoutEffect(() => {
    const saved = localStorage.getItem('userDetails');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return <UserContext.Provider value={{user, setUser}}>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<TopicListPage />} />
        <Route path="/post" element={<CreateTopicPage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </UserContext.Provider>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
