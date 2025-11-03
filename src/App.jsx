import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Import the main layout and all the pages
import RootLayout from './layout/RootLayout';
import StockVisibilityPage from './pages/StockVisibilityPage';
import SpoilagePage from './pages/SpoilagePage';
import DamagedGoodsPage from './pages/DamagedGoodsPage';
import InvoicesPage from './pages/InvoicesPage';
import ThresholdsPage from './pages/ThresholdsPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import InventoryPage from './pages/InventoryPage';
import Signup from './pages/Signup';

import MakerDashboard from './dashboards/MakerDashboard';
import CheckerDashboard from './dashboards/CheckerDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import MySubmissions from './pages/MySubmissions';
import RequireAuth from './components/RequireAuth.jsx';
import RequireRole from './components/RequireRole.jsx';
import { useAuth } from './context/AuthContext.jsx';

function RedirectToDashboard() {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'maker') return <Navigate to="/DashboardMaker" replace />;
  if (role === 'checker') return <Navigate to="/DashboardChecker" replace />;
  if (role === 'manager') return <Navigate to="/manager-dashboard" replace />;
  return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  // Public routes
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },

  // Protected app routes (require auth)
  {
    path: '/',
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <RedirectToDashboard /> },
      { path: 'DashboardMaker', element: (
          <RequireRole allowed={['maker']}>
            <MakerDashboard />
          </RequireRole>
        )
      },
      { path: 'my-submissions', element: <MySubmissions /> },
      { path: 'DashboardChecker', element: (
          <RequireRole allowed={['checker']}>
            <CheckerDashboard />
          </RequireRole>
        )
      },
      { path: 'manager-dashboard', element: (
          <RequireRole allowed={['manager']}>
            <ManagerDashboard />
          </RequireRole>
        )
      },
      { path: 'inventory', element: <InventoryPage />, children: [
          { path: 'stock-visibility', element: <StockVisibilityPage /> },
          { path: 'spoilage', element: <SpoilagePage /> },
          { path: 'damaged-goods', element: <DamagedGoodsPage /> },
        ]
      },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'thresholds', element: <ThresholdsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Default: go to login if nothing else matches
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
};
