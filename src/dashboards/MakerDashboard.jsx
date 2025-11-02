import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../api/client';
import {
    ArrowRight,
    PlusSquare,
    UploadCloud,
    ClipboardList,
    Box,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Quick Action Card Component
const ActionCard = ({ title, description, icon: Icon, href }) => (
    <Link
        to={href}
        className="group flex flex-col justify-between rounded-xl 
               bg-[#29190D]/70 p-6 shadow-lg shadow-black/30 
               backdrop-blur-sm transition-all
               hover:bg-white/10 hover:shadow-amber-900/40"
    >
        <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600/20 text-amber-500">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div className="mt-4 flex items-center text-sm font-medium text-amber-500 transition-all group-hover:translate-x-1 group-hover:text-amber-400">
            Start now <ArrowRight className="ml-1.5 h-4 w-4" />
        </div>
    </Link>
);

const statusColor = {
    PENDING: 'text-yellow-400 bg-yellow-500/10',
    APPROVED: 'text-green-400 bg-green-500/10',
    REJECTED: 'text-red-400 bg-red-500/10',
};

const MakerDashboard = () => {
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadRecent = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/inventory/me');
            setRecent(Array.isArray(data) ? data : []);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) console.warn('Please log in as Maker/Admin to see your submissions.');
            else console.warn('Failed to load recent submissions:', err?.response?.data || err?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecent();
    }, []);

    return (
        <div className="animate-fadeIn">
            <PageHeader title="Welcome, Maker!" description="Ready to add new inventory? Start here." />

            {/* --- Quick Actions --- */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ActionCard title="Add New Stock (Manual)" description="Enter new items one by one." icon={PlusSquare} href="/inventory" />
                <ActionCard title="Upload Inventory File" description="Bulk upload via CSV file." icon={UploadCloud} href="/inventory" />
                <ActionCard title="View My Submissions" description="Track your pending and past entries." icon={ClipboardList} href="/my-submissions" />
            </div>

            {/* Keep external section minimal or remove if not needed */}
        </div>
    );
};

export default MakerDashboard;
