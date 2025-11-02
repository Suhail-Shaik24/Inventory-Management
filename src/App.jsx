import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import the main layout and all the pages
import RootLayout from './layout/RootLayout';
import DashboardPage from './pages/DashboardPage';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <ManagerDashboard />,
      },
      {
        path: 'DashboardMaker',
        element: <MakerDashboard />,
      },
      {
        path: 'my-submissions',
        element: <MySubmissions />,
      },
      {
        path: 'DashboardChecker',
        element: <CheckerDashboard />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
        children: [
          {
            path: 'stock-visibility',
            element: <StockVisibilityPage />,
          },
          {
            path: 'spoilage',
            element: <SpoilagePage />,
          },
          {
            path: 'damaged-goods',
            element: <DamagedGoodsPage />,
          },
        ]
      },

      {
        path: 'invoices',
        element: <InvoicesPage />,
      },
      {
        path: 'thresholds',
        element: <ThresholdsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },

    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
};
