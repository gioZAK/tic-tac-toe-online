// client/src/components/AuthPage.jsx
import { useState } from 'react';
import { auth } from '../firebase';
import { saveUserToFirestore } from '../utils/saveUserToFirestore';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

function AuthPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      onLogin(result.user);
      await saveUserToFirestore(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

const handleEmailAuth = async (e) => {
  e.preventDefault();
  try {
    const result = isRegister
      ? await createUserWithEmailAndPassword(auth, email, password)
      : await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user); // ✅ Add this line
    onLogin(result.user);
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Welcome to Tic Tac Toe 🎮</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleEmailAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account?' : 'Create Account'}
      </button>

      <hr />
      <button onClick={handleGuestLogin}>Continue as Guest 👻</button>
    </div>
  );
}

export default AuthPage;
