import PageHeader from '../components/PageHeader';
import { LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profileUser, setProfileUser] = useState(user);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        let mounted = true;
        // If user not available in context (e.g., on page refresh), try fetching from backend
        async function fetchMe() {
            if (user) {
                setProfileUser(user);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const { data } = await api.get('/api/auth/token/me');
                if (mounted) setProfileUser(data?.user || null);
            } catch (e) {
                if (mounted) setProfileUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchMe();
        return () => { mounted = false; };
    }, [user]);

    const displayName = useMemo(() => profileUser?.username || profileUser?.name || 'User', [profileUser]);
    const displayEmail = useMemo(() => profileUser?.email || '—', [profileUser]);
    const displayRole = useMemo(() => {
        const r = profileUser?.role ? String(profileUser.role) : '';
        return r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : '—';
    }, [profileUser]);
    const avatarText = useMemo(() => (displayName || 'U').split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase(), [displayName]);
    const avatar = `https://placehold.co/100x100/EAB308/1C1917?text=${encodeURIComponent(avatarText)}`;

    const handleSignOut = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="p-4 md:p-8">
            <PageHeader title="My Profile" />

            <div className="max-w-md">
                <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
                    {loading ? (
                        <p className="text-gray-300">Loading profile…</p>
                    ) : !profileUser ? (
                        <div>
                            <p className="text-gray-300">You are not logged in.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-500"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center space-x-4">
                                <img
                                    className="h-20 w-20 rounded-full object-cover"
                                    src={avatar}
                                    alt="User Profile"
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/EAB308/1C1917?text=U')}
                                />
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">{displayName}</h2>
                                    <p className="text-gray-400">{displayEmail}</p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-700 pt-6">
                                <div className="flex items-center space-x-3">
                                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">
                                        Current Role: <span className="font-medium text-white">{displayRole}</span>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
