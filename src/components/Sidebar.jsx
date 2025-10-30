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

// Sidebar now uses <NavLink> for routing and no longer needs
// 'currentPage' or 'setCurrentPage' props.
const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const [openMenus, setOpenMenus] = useState({ inventory: true });

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
                // Use end={true} for the root dashboard link to avoid partial matches
                end={to === '/'}
                className={({ isActive }) =>
                    `flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isChild ? 'pl-7' : ''
                    } ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
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
            <AppNavLink to="/" label="Dashboard" icon={LayoutDashboard} />

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
                {openMenus.inventory && (
                    <div className="mt-1 space-y-1">
                        <AppNavLink
                            to="/inventory/stock-visibility"
                            label="Stock Visibility"
                            icon={Store}
                            isChild
                        />
                        <AppNavLink
                            to="/inventory/spoilage"
                            label="Spoilage Alerts"
                            icon={CalendarX}
                            isChild
                        />
                        <AppNavLink
                            to="/inventory/damaged-goods"
                            label="Damaged Goods"
                            icon={PackageX}
                            isChild
                        />
                    </div>
                )}
            </div>

            <AppNavLink
                to="/invoices"
                label="Invoice Management"
                icon={FileText}
            />
            <AppNavLink
                to="/thresholds"
                label="Stock Thresholds"
                icon={FileWarning}
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


// import { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//     LayoutDashboard,
//     Boxes,
//     X,
//     ChevronDown,
//     ChevronRight,
//     PackageX,
//     Store,
//     CalendarX,
//     FileWarning,
//     FileText,
// } from 'lucide-react';
// import { Full_Logo } from "../assets";

// const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
//     const [openMenus, setOpenMenus] = useState({ inventory: true });
//     const [role, setRole] = useState(null);

//     useEffect(() => {
//         const savedRole = localStorage.getItem('role');
//         setRole(savedRole);
//     }, []);

//     const toggleMenu = (menu) => {
//         setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
//     };

//     const closeMobileMenu = () => {
//         if (isMobileOpen) setIsMobileOpen(false);
//     };

//     const AppNavLink = ({ to, label, icon, isChild = false }) => {
//         const IconComponent = icon;
//         return (
//             <NavLink
//                 to={to}
//                 onClick={closeMobileMenu}
//                 end={to === '/'}
//                 className={({ isActive }) =>
//                     `flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isChild ? 'pl-7' : ''
//                     } ${isActive
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                     }`
//                 }
//             >
//                 <IconComponent className={`mr-3 h-5 w-5 ${isChild ? 'h-4 w-4' : ''}`} />
//                 <span>{label}</span>
//             </NavLink>
//         );
//     };

//     // 🎯 Define what each role can see
//     const menuConfig = {
//         admin: [
//             { to: '/', label: 'Dashboard', icon: LayoutDashboard },
//             {
//                 type: 'section',
//                 label: 'Inventory',
//                 icon: Boxes,
//                 children: [
//                     { to: '/inventory/stock-visibility', label: 'Stock Visibility', icon: Store },
//                     { to: '/inventory/spoilage', label: 'Spoilage Alerts', icon: CalendarX },
//                     { to: '/inventory/damaged-goods', label: 'Damaged Goods', icon: PackageX },
//                 ],
//             },
//             { to: '/invoices', label: 'Invoice Management', icon: FileText },
//             { to: '/thresholds', label: 'Stock Thresholds', icon: FileWarning },
//         ],

//         maker: [
//             { to: '/DashboardMaker', label: 'Maker Dashboard', icon: LayoutDashboard },
//             {
//                 type: 'section',
//                 label: 'Inventory',
//                 icon: Boxes,
//                 children: [
//                     { to: '/inventory/stock-visibility', label: 'Stock Visibility', icon: Store },
//                     { to: '/inventory/spoilage', label: 'Spoilage Alerts', icon: CalendarX },
//                 ],
//             },
//         ],

//         checker: [
//             { to: '/DashboardChecker', label: 'Checker Dashboard', icon: LayoutDashboard },
//             { to: '/invoices', label: 'Invoice Review', icon: FileText },
//         ],
//     };

//     const menus = menuConfig[role] || [];

//     const renderMenuItems = () => (
//         <nav className="flex-1 space-y-2 px-3 py-4">
//             {menus.map((item, index) => {
//                 if (item.type === 'section') {
//                     const isOpen = openMenus[item.label];
//                     return (
//                         <div key={index}>
//                             <button
//                                 onClick={() => toggleMenu(item.label)}
//                                 className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white"
//                             >
//                                 <div className="flex items-center">
//                                     <item.icon className="mr-3 h-5 w-5" />
//                                     <span className="text-sm font-medium">{item.label}</span>
//                                 </div>
//                                 {isOpen ? (
//                                     <ChevronDown className="h-4 w-4" />
//                                 ) : (
//                                     <ChevronRight className="h-4 w-4" />
//                                 )}
//                             </button>

//                             {isOpen && (
//                                 <div className="mt-1 space-y-1">
//                                     {item.children.map((child, idx) => (
//                                         <AppNavLink
//                                             key={idx}
//                                             to={child.to}
//                                             label={child.label}
//                                             icon={child.icon}
//                                             isChild
//                                         />
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 }

//                 return (
//                     <AppNavLink
//                         key={index}
//                         to={item.to}
//                         label={item.label}
//                         icon={item.icon}
//                     />
//                 );
//             })}
//         </nav>
//     );

//     return (
//         <>
//             {/* Mobile Sidebar */}
//             <div
//                 className={`fixed rounded-xl inset-0 z-40 flex transform md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
//                     } transition-transform duration-300 ease-in-out`}
//             >
//                 <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-gray-800">
//                     <div className="absolute right-0 top-0 p-1">
//                         <button
//                             onClick={() => setIsMobileOpen(false)}
//                             className="rounded-full p-2 text-gray-400 hover:bg-gray-700"
//                         >
//                             <X className="h-6 w-6" />
//                         </button>
//                     </div>
//                     <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-gray-700 px-4">
//                         <span className="text-2xl font-bold text-blue-400">eMart</span>
//                     </div>
//                     {renderMenuItems()}
//                 </div>
//                 <div onClick={() => setIsMobileOpen(false)} className="flex-1 bg-black/60"></div>
//             </div>

//             {/* Desktop Sidebar */}
//             <div className="hidden w-64 flex-col border rounded-2xl border-[rgba(244,240,234,0.5)] bg-[rgb(62,37,15,0.5)] md:flex">
//                 <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-[rgba(244,240,234,0.5)] px-4">
//                     <img className="w-32" src={Full_Logo} alt="Full_Logo" />
//                 </div>
//                 {renderMenuItems()}
//             </div>
//         </>
//     );
// };

// export default Sidebar;
