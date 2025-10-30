import React from 'react';
import PageHeader from '../components/PageHeader';
import {
    AlertTriangle,
    PackageCheck,
    PackageX,
    ClipboardList,
    ArrowRight,
    UserCheck,
    FileCheck,
    UserPlus,
    Clock,
} from 'lucide-react';
import StatCard from '../components/StatCard';

// Mock data for approval queue
const approvalQueue = [
    {
        id: 'BATCH-001',
        maker: 'Ben Carter',
        items: 5,
        date: '2025-10-30',
        type: 'Manual Entry',
    },
    {
        id: 'FILE-004',
        maker: 'Ben Carter',
        items: 85,
        date: '2025-10-30',
        type: 'File Upload',
    },
    {
        id: 'BATCH-005',
        maker: 'Alex Chen',
        items: 1,
        date: '2025-10-29',
        type: 'Manual Entry',
    },
];

/**
 * CheckerDashboard Component
 * Dashboard for users with the "Checker" role.
 * Focused on approving or rejecting submissions.
 */
const CheckerDashboard = () => {
    return (
        <div className="animate-fadeIn">
            <PageHeader
                title="Welcome, Checker!"
                description="Here are the inventory submissions awaiting your approval."
            />

            {/* --- KPI Stat Cards --- */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Pending My Approval"
                    value={approvalQueue.length}
                    icon={Clock}
                    color="text-yellow-500"
                    bgColor="bg-yellow-500/10"
                    description="Items needing review"
                />
                <StatCard
                    title="Approved Today"
                    value="12"
                    icon={FileCheck}
                    color="text-green-500"
                    bgColor="bg-green-500/10"
                    description="Total batches verified"
                />
                <StatCard
                    title="Active Makers"
                    value="2"
                    icon={UserPlus}
                    color="text-blue-500"
                    bgColor="bg-blue-500/10"
                    description="Users submitting data"
                />
            </div>

            {/* --- Approval Queue --- */}
            <div
                className="mt-8 rounded-xl bg-[#29190D]/70 shadow-lg 
                   shadow-black/30 backdrop-blur-sm"
            >
                <div className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <UserCheck className="h-5 w-5 text-amber-500" />
                        Approval Queue
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
                                    Maker
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
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {approvalQueue.map((item) => (
                                <tr key={item.id} className="hover:bg-black/10">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                        {item.id}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.maker}
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
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            className="flex items-center gap-1.5 rounded-md bg-amber-600 
                                 px-3 py-1.5 text-xs text-white
                                 transition-all hover:bg-amber-500"
                                        >
                                            Review
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
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

export default CheckerDashboard;
