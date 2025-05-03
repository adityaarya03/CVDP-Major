// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../redux/Slices/authSlice';
import { useRef } from 'react';

export default function ProtectedRoute({ children }) {

  const triedFetching = useRef(false);
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  // useEffect(() => {
  //   if (!user) {
  //     dispatch(fetchUserProfile());
  //   }
  // }, [dispatch, user]);
  useEffect(() => {
    if (!user && !triedFetching.current) {
      dispatch(fetchUserProfile());
      triedFetching.current = true;
    }
  }, [dispatch, user]);

  // 👇 Don't check user until loading is false
  if (loading) return <div>Loading...</div>; // Or a spinner

  return user ? children : <Navigate to="/login" />;
}

