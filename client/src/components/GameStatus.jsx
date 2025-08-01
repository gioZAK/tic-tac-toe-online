import './GameStatus.css';

function GameStatus({ gameState, symbol, roomId, socket, role }) {
  const { currentTurn, winner, draw } = gameState;

  const handlePlayAgain = () => {
    if (socket && roomId) {
      socket.emit('restartGame', roomId);
    }
  };

  return (
    <div className="game-status">
    <p>Room Name: {roomId}</p>
    <p>Score Player A: {gameState.score.playerA} | Player B: {gameState.score.playerB}</p>
    <p>You are: <strong>{role}</strong></p>
      {!winner && !draw && (
        <p>🎯 Turn: <strong>{currentTurn}</strong></p>
      )}

      {winner && (
        <p>🎉 <strong>{winner}</strong> Winner!</p>
      )}

      {draw && (
        <p>🤝 It's a draw!</p>
      )}

      <p>You are playing as <strong>{symbol}</strong></p>

      {(winner || draw) && (
        <button onClick={handlePlayAgain} className="play-again-btn">
          🔁 Play Again
        </button>
      )}
    </div>
  );
}

export default GameStatus;
