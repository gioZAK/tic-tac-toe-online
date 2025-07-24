// client/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import Game from './pages/Game';
import ProtectedRoute from './components/ProtectedRoute';

function App({ socket }) {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Game socket={socket} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
