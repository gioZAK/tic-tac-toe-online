// client/src/App.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

function App() {
  useEffect(() => {
    // Create the socket _inside_ useEffect:
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],       // force WebSocket transport
      // (CORS already configured on the server)
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
    });
    socket.on('connect_error', err => {
      console.error('❌ Connect error:', err);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Online Tic Tac Toe</h1>
    </div>
  );
}

export default App;
