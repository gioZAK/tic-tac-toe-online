import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import Game from './pages/Game'; // Wraps Game UI (RoomForm, GameBoard, GameStatus)

function App({ socket }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/game" element={<Game socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
