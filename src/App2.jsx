import React, { useState } from 'react';

// We'll use 'recharts' for charts
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Using 'lucide-react' for icons
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Warehouse,
  Package,
  TriangleAlert,
  CalendarClock,
  CircleOff,
  ClipboardCheck,
  LogOut,
  ShieldCheck,
  PackageX,
  Store,
  CalendarX,
  FileWarning,
} from 'lucide-react';

// --- Mock Data (as described in problem statement) ---

// 1. Stock Levels (Warehouse vs. Shelf)
const stockLevelData = [
  { name: 'Apples', warehouse: 400, shelf: 120 },
  { name: 'Oranges', warehouse: 300, shelf: 80 },
  { name: 'Milk', warehouse: 500, shelf: 150 },
  { name: 'Bread', warehouse: 200, shelf: 200 },
  { name: 'Eggs', warehouse: 600, shelf: 180 },
];

// 2. Damaged Goods Breakdown
const damagedGoodsData = [
  { name: 'Transport', value: 45 },
  { name: 'Expiry', value: 80 },
  { name: 'Shopping', value: 25 },
];
const PIE_COLORS = ['#FF8042', '#FFBB28', '#00C49F'];

// 3. Alerts (Spoilage & Low Stock)
const alertData = [
  {
    id: 1,
    type: 'Spoilage',
    item: 'FreshYogurt (Batch 45A)',
    details: 'Expires in 2 days',
    level: 'high',
  },
  {
    id: 2,
    type: 'Low Stock',
    item: 'Organic Bananas',
    details: 'Shelf stock at 15 units (Threshold: 20)',
    level: 'medium',
  },
  {
    id: 3,
    type: 'Low Stock',
    item: 'Whole Milk (1L)',
    details: 'Warehouse stock at 50 units (Threshold: 50)',
    level: 'medium',
  },
  {
    id: 4,
    type: 'Spoilage',
    item: 'Ground Beef (Batch 22C)',
    details: 'Expires in 3 days',
    level: 'high',
  },
];

// 4. Maker-Checker Queue
const approvalData = [
  {
    id: 1,
    maker: 'John D.',
    action: 'Uploaded new inventory file',
    timestamp: '2025-10-29 14:30',
  },
  {
    id: 2,
    maker: 'Jane A.',
    action: 'Entered manual stock (10 units, Soda)',
    timestamp: '2025-10-29 14:45',
  },
];

// --- Reusable UI Components ---

// StatCard Component for key metrics
const StatCard = ({ title, value, icon, unit, color }) => {
  const IconComponent = icon;
  return (
    <div className="flex-1 rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20 transition-all hover:bg-gray-700/60">
      <div className="flex items-center space-x-3">
        <div className={`rounded-full p-3 ${color}`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-white">
            {value} <span className="text-base font-normal">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Page Header
const PageHeader = ({ title, children }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-white">{title}</h1>
    {children && <p className="mt-1 text-gray-400">{children}</p>}
  </div>
);

// --- Page Components (for Navigation) ---

const DashboardContent = () => {
  const chartTextColor = '#D1D5DB'; // gray-300
  const chartGridColor = 'rgb(55 65 81)'; // gray-700
  const tooltipBg = 'rgb(31 41 55)'; // gray-800

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* 1. Key Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="High-Priority Alerts"
          value={alertData.filter((a) => a.level === 'high').length}
          unit="items"
          icon={TriangleAlert}
          color="bg-red-600"
        />
        <StatCard
          title="Pending Approvals"
          value={approvalData.length}
          unit="tasks"
          icon={ClipboardCheck}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Damaged"
          value={damagedGoodsData.reduce((acc, item) => acc + item.value, 0)}
          unit="units (24h)"
          icon={CircleOff}
          color="bg-orange-600"
        />
        <StatCard
          title="Inventory Uploads"
          value={3}
          unit="files (24h)"
          icon={ClipboardList}
          color="bg-blue-600"
        />
      </div>

      {/* 2. Charts (Stock & Damage) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Stock Level Chart */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-100">
            Stock Levels: Warehouse vs. Shelf
          </h3>
          <div className="mt-4 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevelData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGridColor}
                />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  tick={{ fill: chartTextColor }}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: chartTextColor }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                  itemStyle={{ color: chartTextColor }}
                  labelStyle={{ color: chartTextColor }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ color: chartTextColor }}
                />
                <Bar
                  dataKey="warehouse"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="shelf"
                  fill="#93C5FD"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Damaged Goods Chart */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-100">
            Damaged Goods Breakdown
          </h3>
          <div className="mt-4 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={damagedGoodsData}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                  stroke={chartGridColor}
                >
                  {damagedGoodsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                  itemStyle={{ color: chartTextColor }}
                  labelStyle={{ color: chartTextColor }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ color: chartTextColor }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Lists (Alerts & Approvals) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Alerts List */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20">
          <h3 className="mb-3 text-lg font-semibold text-gray-100">
            Active Alerts
          </h3>
          <div className="space-y-3">
            {alertData.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 rounded-lg border border-gray-700 p-3"
              >
                <div
                  className={`mt-1 rounded-full p-1.5 ${
                    alert.type === 'Spoilage'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}
                >
                  {alert.type === 'Spoilage' ? (
                    <CalendarClock className="h-4 w-4" />
                  ) : (
                    <TriangleAlert className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-200">{alert.item}</p>
                  <p className="text-sm text-gray-400">{alert.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20">
          <h3 className="mb-3 text-lg font-semibold text-gray-100">
            Maker-Checker Approval Queue
          </h3>
          <div className="space-y-3">
            {approvalData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-700 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-700 p-2">
                    <User className="h-5 w-5 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{item.action}</p>
                    <p className="text-sm text-gray-400">
                      By: {item.maker} at {item.timestamp}
                    </p>
                  </div>
                </div>
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500">
                  Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder page for Stock Visibility
const StockVisibilityPage = () => (
  <div className="p-4 md:p-8">
    <PageHeader title="Real-time Stock Visibility">
      Monitor exact stock available in the warehouse vs. on the shelf.
    </PageHeader>
    {/* Content for this page goes here */}
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-semibold text-white">Live Data (Placeholder)</h2>
      <p className="text-gray-400">
        This area would contain live-updating tables or charts for warehouse and
        shelf stock.
      </p>
    </div>
  </div>
);

// Placeholder page for Spoilage
const SpoilagePage = () => (
  <div className="p-4 md:p-8">
    <PageHeader title="Product Spoilage Alerts">
      Receive warnings 2-3 days before edible stock spoils.
    </PageHeader>
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-semibold text-white">Items Nearing Expiry</h2>
      <p className="text-gray-400">
        A list of all products with expiry dates within the next 3 days would
        appear here.
      </p>
    </div>
  </div>
);

// Placeholder page for Damaged Goods
const DamagedGoodsPage = () => (
  <div className="p-4 md:p-8">
    <PageHeader title="Damaged Goods Tracking">
      Categorize and identify damaged goods by their cause.
    </PageHeader>
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-semibold text-white">Damage Report (Placeholder)</h2>
      <p className="text-gray-400">
        Charts and forms for reporting damage (Transport, Shopping, Expiry) would
        be here.
      </p>
    </div>
  </div>
);

// Placeholder page for Invoices
const InvoicesPage = () => (
  <div className="p-4 md:p-8">
    <PageHeader title="Invoice Management">
      Manage all incoming stock invoices and outgoing reverse invoices.
    </PageHeader>
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-semibold text-white">Invoice List (Placeholder)</h2>
      <p className="text-gray-400">
        A searchable, filterable table of all invoices (incoming and reverse)
        would be displayed here.
      </p>
    </div>
  </div>
);

// Placeholder page for Thresholds
const ThresholdsPage = () => (
  <div className="p-4 md:p-8">
    <PageHeader title="Stock Threshold Alerts">
      Manage and receive alerts when stock levels fall below a set threshold.
    </PageHeader>
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-semibold text-white">Set Alert Rules (Placeholder)</h2>
      <p className="text-gray-400">
        This page would allow administrators to set, view, and edit the low-stock
        thresholds for each product.
      </p>
    </div>
  </div>
);

// Profile Page
const ProfilePage = () => {
  const handleSignOut = () => {
    // In a real app, this would clear auth tokens, context, etc.
    console.log('User signed out');
    // Here you might redirect to a login page
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="My Profile" />
      <div className="max-w-md">
        <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
          <div className="flex items-center space-x-4">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src="https://placehold.co/100x100/3B82F6/FFFFFF?text=AU"
              alt="User Profile"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">Shop User</h2>
              <p className="text-gray-400">shop.user@emart.com</p>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-700 pt-6">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">
                Current Role: <span className="font-medium text-white">Admin</span>
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Application Components ---

// Sidebar Component
const Sidebar = ({
  isMobileOpen,
  setIsMobileOpen,
  currentPage,
  setCurrentPage,
}) => {
  const [openMenus, setOpenMenus] = useState({ inventory: true });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const NavLink = ({ page, label, icon, isChild = false }) => {
    const IconComponent = icon;
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => handleNavClick(page)}
        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isChild ? 'pl-7' : ''
        } ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <IconComponent
          className={`mr-3 h-5 w-5 ${isChild ? 'h-4 w-4' : ''}`}
        />
        <span>{label}</span>
      </button>
    );
  };

  const menuItems = (
    <nav className="flex-1 space-y-2 px-3 py-4">
      <NavLink page="dashboard" label="Dashboard" icon={LayoutDashboard} />

      {/* Inventory Menu (Collapsible) */}
      <div>
        <button
          onClick={() => toggleMenu('inventory')}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <div className="flex items-center">
            <Boxes className="mr-3 h-5 w-5" />
            <span className="text-sm font-medium">Inventory</span>
          </div>
          {openMenus.inventory ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {openMenus.inventory && (
          <div className="mt-1 space-y-1">
            <NavLink
              page="stock-visibility"
              label="Stock Visibility"
              icon={Store}
              isChild
            />
            <NavLink
              page="spoilage"
              label="Spoilage Alerts"
              icon={CalendarX}
              isChild
            />
            <NavLink
              page="damaged-goods"
              label="Damaged Goods"
              icon={PackageX}
              isChild
            />
          </div>
        )}
      </div>

      <NavLink
        page="invoices"
        label="Invoice Management"
        icon={FileText}
      />
      <NavLink
        page="thresholds"
        label="Stock Thresholds"
        icon={FileWarning}
      />
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 flex transform md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Content */}
        <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-gray-800">
          <div className="absolute right-0 top-0 p-1">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-700 px-4">
            <span className="text-2xl font-bold text-blue-400">eMart</span>
          </div>
          {menuItems}
        </div>
        {/* Overlay */}
        <div
          onClick={() => setIsMobileOpen(false)}
          className="flex-1 bg-black/60"
        ></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-col border-r border-gray-700 bg-gray-800 md:flex">
        <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-700 px-4">
          <span className="text-2xl font-bold text-blue-400">eMart</span>
        </div>
        {menuItems}
      </div>
    </>
  );
};

// Header Component
const Header = ({ setIsMobileOpen, setCurrentPage }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const handleSignOut = () => {
    // In a real app, this would clear auth tokens, context, etc.
    console.log('User signed out');
    setIsProfileOpen(false);
    // Here you might redirect to a login page
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800/80 px-4 backdrop-blur-sm md:px-8">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="rounded-full p-2 text-gray-300 hover:bg-gray-700 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer */}
      <div className="md:flex-1"></div>

      {/* Right side icons & profile */}
      <div className="flex items-center space-x-3">
        {/* Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative rounded-full p-2 text-gray-300 hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-gray-800 shadow-lg ring-1 ring-black/5">
              <div className="p-3">
                <p className="text-sm font-medium text-white">Notifications</p>
              </div>
              <div className="border-t border-gray-700">
                {alertData.slice(0, 3).map((alert) => (
                  <a
                    key={alert.id}
                    href="#"
                    className="flex items-start space-x-3 p-3 hover:bg-gray-700"
                  >
                    <div
                      className={`mt-1 rounded-full p-1.5 ${
                        alert.type === 'Spoilage'
                          ? 'bg-red-900 text-red-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}
                    >
                      {alert.type === 'Spoilage' ? (
                        <CalendarClock className="h-4 w-4" />
                      ) : (
                        <TriangleAlert className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {alert.item}
                      </p>
                      <p className="text-xs text-gray-400">{alert.details}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 rounded-full p-1 pr-2 text-left hover:bg-gray-700"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://placehold.co/100x100/3B82F6/FFFFFF?text=AU"
              alt="User Profile"
            />
            <div className="hidden text-sm md:block">
              <p className="font-medium text-white">Shop User</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 py-1 shadow-lg ring-1 ring-black/5">
              <button
                onClick={() => {
                  setCurrentPage('profile');
                  setIsProfileOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Main App Component (Entry Point) ---
// This is the default export
export default function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'stock-visibility':
        return <StockVisibilityPage />;
      case 'spoilage':
        return <SpoilagePage />;
      case 'damaged-goods':
        return <DamagedGoodsPage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'thresholds':
        return <ThresholdsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    // Added 'dark' class to the root element to enable Tailwind's dark mode
    <div className="dark flex h-screen w-full bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          setIsMobileOpen={setIsMobileOpen}
          setCurrentPage={setCurrentPage}
        />

        {/* Page Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
