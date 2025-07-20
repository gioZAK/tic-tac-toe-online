// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import socket from './socket';
import './styles/App.css'; // Optional if you add styling later

// You can optionally use Context here in future
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
