import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/useAuthStore';

export const AuthGuard = () => {
  const { isAuthenticated } = useAuthStore();


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};