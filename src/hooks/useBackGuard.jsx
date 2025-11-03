import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function getDashboardPathForRole(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'maker') return '/DashboardMaker';
  if (r === 'checker') return '/DashboardChecker';
  if (r === 'admin' || r === 'manager') return '/manager-dashboard';
  return '/login';
}

export default function useBackGuard({ allowedRoles = [], stayPath }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const userRole = useMemo(() => String(user?.role || '').toLowerCase(), [user]);
  const allowed = useMemo(() => allowedRoles.map((r) => String(r).toLowerCase()), [allowedRoles]);

  useEffect(() => {
    // Role-based redirect: if user is present and not allowed, send to their dashboard
    if (user && allowed.length && !allowed.includes(userRole)) {
      navigate(getDashboardPathForRole(userRole), { replace: true });
      return;
    }

    // Back-button guard: keep user on this page and open confirm modal
    const url = window.location.href;
    window.history.pushState({ guard: stayPath }, '', url);

    const onPopState = () => {
      window.history.pushState({ guard: stayPath }, '', url);
      setOpen(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [user, userRole, allowed, stayPath, navigate]);

  const onConfirm = () => {
    setOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const onCancel = () => {
    setOpen(false);
    navigate(stayPath || getDashboardPathForRole(userRole), { replace: true });
  };

  return { confirmOpen: open, onConfirm, onCancel };
}
