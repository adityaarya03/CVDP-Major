// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isLoggedIn();
      setAuthenticated(isAuth);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!authChecked) return null; // Or a loading spinner

  return authenticated ? children : <Navigate to="/login" />;
}
