// client/src/pages/Game.jsx
import { useEffect, useState } from 'react';
import RoomForm from '../components/RoomForm';
import GameBoard from '../components/GameBoard';
import GameStatus from '../components/GameStatus';

function Game({ socket }) {
  const [roomId, setRoomId] = useState('');
  const [role, setRole] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
    });

    socket.on('playerInfo', ({ roomId, role, symbol }) => {
      setRoomId(roomId);
      setRole(role);
      setSymbol(symbol);
      console.log(`🎮 You are ${role}, playing as ${symbol}`);
    });

    socket.on('gameUpdate', (game) => {
      setGameState(game);
      console.log('🌀 Game state updated:', game);
    });

    socket.on('joinError', (msg) => {
      alert(`Join failed: ${msg}`);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connect error:', err);
    });

    return () => {
      socket.off();
    };
  }, [socket]);

  return (
    <div className="App" style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🎯 Online Tic Tac Toe</h1>

      {!roomId && socket && <RoomForm socket={socket} />}

      {roomId && gameState && (
        <>
          <GameStatus
            gameState={gameState}
            symbol={symbol}
            role={role}
            roomId={roomId}
            socket={socket}
          />
          <GameBoard
            gameState={gameState}
            symbol={symbol}
            roomId={roomId}
            socket={socket}
          />
        </>
      )}
    </div>
  );
}

export default Game;
