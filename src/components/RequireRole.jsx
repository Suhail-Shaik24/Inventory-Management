import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function getDashboardPathForRole(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'maker') return '/DashboardMaker';
  if (r === 'checker') return '/DashboardChecker';
  if (r === 'manager') return '/manager-dashboard';
  return '/login';
}

export default function RequireRole({ allowed = [], children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const userRole = String(user.role || '').toLowerCase();
  const allowedLower = allowed.map((r) => String(r).toLowerCase());
  if (!allowedLower.includes(userRole)) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }
  return children;
}
