const games = {};

function createGame(roomId, socketId) {
  games[roomId] = {
    board: Array(9).fill(null),
    players: {
      playerA: socketId,
      playerB: null
    },
    symbols: {
      [socketId]: 'X'
    },
    currentTurn: 'X',
    score: {
      playerA: 0,
      playerB: 0
    },
    winner: null,
    draw: false
  };
}

function joinGame(roomId, socketId) {
  const game = games[roomId];
  if (game && game.players.playerB === null) {
    game.players.playerB = socketId;
    game.symbols[socketId] = 'O';
    return true;
  }
  return false;
}

function getPlayerSymbol(roomId, socketId) {
  const game = games[roomId];
  if (!game) return null;
  return game.symbols[socketId];
}

function getPlayerIdBySymbol(game, symbol) {
  return Object.entries(game.symbols).find(([, sym]) => sym === symbol)?.[0];
}

function makeMove(roomId, index, symbol, socketId) {
  const game = games[roomId];
  if (!game || game.board[index]) return null;

  const playerSymbol = game.symbols[socketId];
  if (!playerSymbol || playerSymbol !== game.currentTurn || playerSymbol !== symbol) {
    return null; // Invalid move
  }

  game.board[index] = symbol;

  const winnerSymbol = checkWinner(game.board);
  let draw = false;
  let winner = null;

  if (winnerSymbol) {
    const winnerSocketId = getPlayerIdBySymbol(game, winnerSymbol);
    if (winnerSocketId === game.players.playerA) {
      game.score.playerA++;
      winner = 'playerA';
    } else {
      game.score.playerB++;
      winner = 'playerB';
    }
    game.winner = winner;
  } else if (!game.board.includes(null)) {
    draw = true;
    game.draw = true;
  }

  game.currentTurn = symbol === 'X' ? 'O' : 'X';

  return {
    board: game.board,
    currentTurn: game.currentTurn,
    players: game.players,
    symbols: game.symbols,
    score: game.score,
    winner,
    draw
  };
}

function restartGame(roomId) {
  const game = games[roomId];
  if (!game) return;

  const [idA, idB] = [game.players.playerA, game.players.playerB];

  // Swap player symbols (X <-> O)
  if (idA && idB) {
    const temp = game.symbols[idA];
    game.symbols[idA] = game.symbols[idB];
    game.symbols[idB] = temp;
  }

  game.board = Array(9).fill(null);
  game.currentTurn = 'X';
  game.winner = null;
  game.draw = false;

  return {
    board: game.board,
    currentTurn: game.currentTurn,
    players: game.players,
    symbols: game.symbols,
    score: game.score,
    winner: null,
    draw: false
  };
}

function checkWinner(board) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a]; // return 'X' or 'O'
    }
  }
  return null;
}

function getGame(roomId) {
  return games[roomId];
}

function cleanupGame(roomId) {
  delete games[roomId];
}

module.exports = {
  createGame,
  joinGame,
  makeMove,
  restartGame,
  getGame,
  getPlayerSymbol,
  cleanupGame
};
