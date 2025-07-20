// client/src/components/GameBoard.jsx
import './GameBoard.css';

function GameBoard({ gameState, symbol, roomId, socket }) {
  const { board, winner, draw, currentTurn } = gameState;

  const handleClick = (index) => {
    // Don't allow moves if:
    if (
      board[index] !== null ||     // square is taken
      winner || draw ||            // game over
      currentTurn !== symbol       // not your turn
    ) return;

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

      {(winner || draw) && (
        <div className="result">
          {winner ? `🎉 ${winner} wins!` : '🤝 It\'s a draw!'}
        </div>
      )}
    </div>
  );
}

export default GameBoard;
