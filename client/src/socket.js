import { io } from 'socket.io-client';

const socket = io('https://tic-tac-toe-online-7ug2.onrender.com', {
  transports: ['websocket']
});

export default socket;
