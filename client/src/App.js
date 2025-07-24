// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import Game from './pages/Game';
import ProtectedRoute from './components/ProtectedRoute';

function App({ socket }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('🔐 Logged in user:', user);
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<AuthPage onLogin={setUser} />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/game"
        element={
          <ProtectedRoute user={user}>
            <Game socket={socket} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
