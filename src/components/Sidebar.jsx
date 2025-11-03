import { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import {
    LayoutDashboard,
    Boxes,
    X,
    ChevronDown,
    ChevronRight,
    PackageX,
    Store,
    CalendarX,
    FileWarning,
    FileText,
} from 'lucide-react';
import { Full_Logo } from "../assets";
import { useAuth } from '../context/AuthContext.jsx';

// Sidebar now uses <NavLink> for routing and no longer needs
// 'currentPage' or 'setCurrentPage' props.
const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const [openMenus, setOpenMenus] = useState({ inventory: true });
    const { user } = useAuth();

    // Resolve role from context or localStorage (fallback)
    const roleCtx = (user?.role || '').toString().toLowerCase();
    const roleLS = (typeof window !== 'undefined' ? (localStorage.getItem('role') || '') : '').toLowerCase();
    const role = roleCtx || roleLS;

    // Map role to its dashboard route based on existing app routes
    const dashboardPath = role === 'manager'
        ? '/manager-dashboard'
        : role === 'checker'
            ? '/DashboardChecker'
            : role === 'maker'
                ? '/DashboardMaker'
                : '/';

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    const closeMobileMenu = () => {
        if (isMobileOpen) {
            setIsMobileOpen(false);
        }
    };

    // Reusable NavLink component using react-router-dom's NavLink
    // It automatically handles the 'active' state
    const AppNavLink = ({ to, label, icon, isChild = false }) => {
        const IconComponent = icon;
        return (
            <NavLink
                to={to}
                onClick={closeMobileMenu}
                // Use end={true} only when linking to root
                end={to === '/'}
                className={({ isActive }) =>
                    `flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isChild ? 'pl-7' : ''}
                    ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
            >
                <IconComponent
                    className={`mr-3 h-5 w-5 ${isChild ? 'h-4 w-4' : ''}`}
                />
                <span>{label}</span>
            </NavLink>
        );
    };

    const menuItems = (
        <nav className="flex-1 space-y-2 px-3 py-4">
            {/* Dashboard route is role-aware */}
            <AppNavLink to={dashboardPath} label="Dashboard" icon={LayoutDashboard} />

            {/* Inventory Menu (Collapsible) */}
            <div>
                <NavLink to="/inventory"> <button
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
                </NavLink>
               
            </div>

            <AppNavLink
                to="/invoices"
                label="Invoice Management"
                icon={FileText}
            />
           
        </nav>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div
                className={`fixed rounded-xl inset-0 z-40 flex transform md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
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
                    <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-gray-700 px-4">
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
            <div className="hidden w-64 flex-col border rounded-2xl border-[rgba(244,240,234,0.5)] bg-[rgb(62,37,15,0.5)] md:flex">
                <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-[rgba(244,240,234,0.5)] px-4">
                    <img className='w-32' src={Full_Logo} alt="Full_Logo" />
                </div>
                {menuItems}
            </div>
        </>
    );
};

export default Sidebar;