import React from 'react';
import PageHeader from '../components/PageHeader';
import {
    ArrowRight,
    PlusSquare,
    UploadCloud,
    ClipboardList,
    Box,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for recent submissions
const recentSubmissions = [
    {
        id: 'BATCH-001',
        status: 'Pending',
        items: 5,
        date: '2025-10-30',
        type: 'Manual Entry',
    },
    {
        id: 'FILE-002',
        status: 'Approved',
        items: 120,
        date: '2025-10-29',
        type: 'File Upload',
    },
    {
        id: 'BATCH-003',
        status: 'Rejected',
        items: 2,
        date: '2025-10-29',
        type: 'Manual Entry',
    },
];

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
            <div
                className="flex h-12 w-12 items-center justify-center 
                   rounded-lg bg-amber-600/20 text-amber-500"
            >
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div
            className="mt-4 flex items-center text-sm font-medium 
                 text-amber-500 transition-all 
                 group-hover:translate-x-1 group-hover:text-amber-400"
        >
            Start now <ArrowRight className="ml-1.5 h-4 w-4" />
        </div>
    </Link>
);

const MakerDashboard = () => {
    const statusColor = {
        Pending: 'text-yellow-400 bg-yellow-500/10',
        Approved: 'text-green-400 bg-green-500/10',
        Rejected: 'text-red-400 bg-red-500/10',
    };

    return (
        <div className="animate-fadeIn">
            <PageHeader
                title="Welcome, Maker!"
                description="Ready to add new inventory? Start here."
            />

            {/* --- Quick Actions --- */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ActionCard
                    title="Add New Stock (Manual)"
                    description="Enter new items one by one."
                    icon={PlusSquare}
                    href="/inventory"
                />
                <ActionCard
                    title="Upload Inventory File"
                    description="Bulk upload via CSV file."
                    icon={UploadCloud}
                    href="/inventory"
                />
                <ActionCard
                    title="View My Submissions"
                    description="Track your pending and past entries."
                    icon={ClipboardList}
                    href="#"
                />
            </div>

            {/* --- Recent Submissions --- */}
            <div
                className="mt-8 rounded-xl bg-[#29190D]/70 shadow-lg 
                   shadow-black/30 backdrop-blur-sm"
            >
                <div className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <Box className="h-5 w-5 text-amber-500" />
                        My Recent Submissions
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-black/10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Batch ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {recentSubmissions.map((item) => (
                                <tr key={item.id} className="hover:bg-black/10">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                        {item.id}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.type}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.items}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.date}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs ${statusColor[item.status]
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MakerDashboard;
