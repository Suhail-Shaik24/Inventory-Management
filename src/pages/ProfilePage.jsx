import PageHeader from '../components/PageHeader';
import { LogOut, ShieldCheck } from 'lucide-react';
import {NavLink} from "react-router-dom";

export default function ProfilePage() {
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
                        <NavLink to="/login">
                        <button
                            onClick={handleSignOut}
                            className="mt-6 flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
