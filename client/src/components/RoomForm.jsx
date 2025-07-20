// client/src/components/RoomForm.jsx
import { useState } from 'react';

function RoomForm({ socket }) {
  const [roomInput, setRoomInput] = useState('');

  const handleCreate = () => {
    const roomId = roomInput.trim();
    if (roomId) {
      socket.emit('createGame', roomId);
    }
  };

  const handleJoin = () => {
    const roomId = roomInput.trim();
    if (roomId) {
      socket.emit('joinGame', roomId);
    }
  };

  return (
    <div>
      <h2>Enter Room</h2>
      <input
        type="text"
        value={roomInput}
        placeholder="Room ID"
        onChange={(e) => setRoomInput(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleCreate} style={{ marginRight: '1rem' }}>
          Create Game
        </button>
        <button onClick={handleJoin}>
          Join Game
        </button>
      </div>
    </div>
  );
}

export default RoomForm;
