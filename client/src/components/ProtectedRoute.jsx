// client/src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function ProtectedRoute({ children, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // store user in App
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, setUser]);

  return children;
}

export default ProtectedRoute;