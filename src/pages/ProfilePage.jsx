import PageHeader from '../components/PageHeader';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profileUser, setProfileUser] = useState(user);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        let mounted = true;
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
    const avatar = `https://placehold.co/120x120/EAB308/1C1917?text=${encodeURIComponent(avatarText)}`;

    return (
        <div className="p-4 md:p-8">
            <PageHeader title="My Profile" />

            <div className="mx-auto max-w-2xl">
                <div className="mx-auto mt-6 w-full max-w-lg rounded-2xl bg-[#29190D]/80 p-8 shadow-xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm">
                    {loading ? (
                        <p className="text-center text-gray-300">Loading profile…</p>
                    ) : !profileUser ? (
                        <div className="text-center">
                            <p className="text-gray-300">You are not logged in.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-500"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <img
                                className="h-24 w-24 rounded-full object-cover ring-2 ring-amber-500/40"
                                src={avatar}
                                alt="User Avatar"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/120x120/EAB308/1C1917?text=U')}
                            />
                            <h2 className="mt-4 text-2xl font-semibold text-white">{displayName}</h2>
                            <p className="mt-1 text-sm text-gray-300">{displayEmail}</p>

                            <div className="mt-6 grid w-full grid-cols-1 gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Username</span>
                                    <span className="font-medium text-white">{displayName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Email</span>
                                    <span className="font-medium text-white">{displayEmail}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Role</span>
                                    <span className="inline-flex items-center gap-2 rounded-lg bg-amber-600/20 px-3 py-1 text-sm font-medium text-amber-300 ring-1 ring-amber-500/30">
                                        <ShieldCheck className="h-4 w-4" />
                                        {displayRole}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
