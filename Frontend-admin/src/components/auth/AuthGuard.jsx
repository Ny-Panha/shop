import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function AuthGuard({ children }) {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(() => authService.isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener('admin_auth_change', handleAuthChange);
    return () => window.removeEventListener('admin_auth_change', handleAuthChange);
  }, []);

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
