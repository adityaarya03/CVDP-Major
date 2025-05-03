import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import HealthReportPage from './pages/HealthReportPage';
import DashboardPage from './pages/DashboardPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import ProtectedRoute from './components/ProtectedRoute';


import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from './redux/Slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (!hasFetched.current) {
  //     dispatch(fetchUserProfile());
  //     hasFetched.current = true;
  //   }
  // }, [dispatch]);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchUserProfile()).unwrap().catch(() => {
        // Backend says session is invalid (e.g., cookie deleted) — clear redux
        localStorage.clear(); // optional
        sessionStorage.clear(); // if used
        // Optionally dispatch logoutUser or reset auth
      });
      hasFetched.current = true;
    }
  }, [dispatch]);

  

  if (loading) return <div>Loading...</div>; // or a full-screen loader

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <HealthReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <AIRecommendationsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


export default App;
