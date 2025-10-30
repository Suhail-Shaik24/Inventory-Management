import { useState, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Menu, LogOut, User, Settings, ShieldCheck } from 'lucide-react';
// Mock data for alerts dropdown (can be moved or fetched)
const alertData = [
    {
        id: 1,
        type: 'Spoilage',
        item: 'FreshYogurt (Batch 45A)',
        details: 'Expires in 2 days',
    },
    {
        id: 2,
        type: 'Low Stock',
        item: 'Organic Bananas',
        details: 'Shelf stock at 15 units',
    },
];

// Header no longer needs 'setCurrentPage'
const Header = ({ setIsMobileOpen }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);

    const handleSignOut = () => {
        // In a real app, this would clear auth tokens, context, etc.
        console.log('User signed out');
        setIsProfileOpen(false);
        // Here you might redirect to a login page
    };
    const user = {
        name: 'Alex Chen',
        role: 'Inventory Manager',
        avatar: `https://placehold.co/256x256/EAB308/1C1917?text=AC`,
    };

    const location = useLocation();
    const pageTitles = {
        '/': 'Dashboard',
        '/inventory': 'Inventory',
        '/inventory/stock-visibility': 'Stock Visibility',
        '/inventory/spoilage': 'Spoilage Alerts',
        '/inventory/damaged-goods': 'Damaged Goods',
        '/invoices': 'Invoice Management',
        '/thresholds': 'Stock Thresholds',
        '/profile': 'Profile',
    };
    // Default to 'Dashboard' if the path isn't recognized
    const currentPageTitle = pageTitles[location.pathname] || 'Dashboard';

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full rounded-full flex-shrink-0 items-center justify-between border border-[rgba(244,240,234,0.5)] bg-[rgb(62,37,15,0.5)] px-4 backdrop-blur-sm md:px-8">
            <div className="flex items-center gap-3">
                {/* --- Mobile Menu Button --- */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="rounded-full p-2 text-gray-300 hover:bg-white/10 md:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* --- Current Page Title (New) --- */}
                <h1 className="text-lg font-semibold text-white">
                    {currentPageTitle}
                </h1>
            </div>

            {/* --- Profile Menu (using Headless UI) --- */}
            <HeadlessMenu as="div" className="relative">
                <div>
                    <HeadlessMenu.Button className="flex items-center space-x-3 rounded-full p-1.5 transition-all hover:bg-white/10">
                        <img
                            className="h-9 w-9 rounded-full object-cover"
                            src={user.avatar}
                            alt="User avatar"
                            onError={(e) =>
                            (e.currentTarget.src =
                                'https://placehold.co/256x256/EAB308/1C1917?text=AC')
                            }
                        />
                        <div className="hidden text-left md:block">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.role}</div>
                        </div>
                    </HeadlessMenu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-white/10 rounded-xl bg-[#29190D] shadow-lg shadow-black/40 ring-1 ring-black/5 focus:outline-none">
                        <div className="p-1">
                            {/* Profile Info in Dropdown (for mobile) */}
                            <div className="px-3 py-2 md:hidden">
                                <div className="text-sm font-medium text-white">
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-400">{user.role}</div>
                            </div>
                            <HeadlessMenu.Item>
                                {({ active }) => (
                                    <Link
                                        to="/profile"
                                        className={`${active ? 'bg-white/10' : ''
                                            } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-200`}
                                    >
                                        <User className="mr-2 h-5 w-5" />
                                        View Profile
                                    </Link>
                                )}
                            </HeadlessMenu.Item>
                            <HeadlessMenu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${active ? 'bg-white/10' : ''
                                            } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-200`}
                                    >
                                        <Settings className="mr-2 h-5 w-5" />
                                        Settings
                                    </button>
                                )}
                            </HeadlessMenu.Item>
                        </div>
                        <div className="p-1">
                            <HeadlessMenu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => console.log('Sign Out')}
                                        className={`${active ? 'bg-red-500/20 text-red-400' : 'text-red-400'
                                            } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                                    >
                                        <LogOut className="mr-2 h-5 w-5" />
                                        Sign out
                                    </button>
                                )}
                            </HeadlessMenu.Item>
                        </div>
                    </HeadlessMenu.Items>
                </Transition>
            </HeadlessMenu>
        </header>
    );
};

export default Header;