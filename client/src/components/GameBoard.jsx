// client/src/components/GameBoard.jsx
import './GameBoard.css';

function GameBoard({ gameState, symbol, roomId, socket }) {
  console.log("🧠 GameBoard received gameState:", gameState);
  const { board, winner, draw, currentTurn } = gameState;

  const handleClick = (index) => {
    if (!socket || !gameState) return;

    const { board, winner, draw, currentTurn } = gameState;

    if (board[index] !== null) return;
    if (winner || draw) return;
    if (currentTurn !== symbol) return;

    socket.emit('makeMove', { roomId, index, symbol });
  };


  return (
    <div>
      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
            disabled={cell !== null || winner || draw || currentTurn !== symbol}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
