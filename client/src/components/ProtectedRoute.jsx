// client/src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children, user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // redirect to login page if not authenticated
    }
  }, [user, navigate]);

  return user ? children : null;
}

export default ProtectedRoute;
