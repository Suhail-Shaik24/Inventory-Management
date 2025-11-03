import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import {
    UserCheck,
    FileCheck,
    UserPlus,
    Clock,
    ArrowRight,
    X,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ConfirmModal from '../components/ConfirmModal.jsx';
import useBackGuard from '../hooks/useBackGuard.jsx';

/**
 * CheckerDashboard Component
 * Dashboard for users with the "Checker" role.
 * Focused on approving or rejecting submissions.
 */
const CheckerDashboard = () => {
    const [pending, setPending] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [acting, setActing] = useState(new Set()); // ids being approved/rejected
    const [reviewItem, setReviewItem] = useState(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1); // 1-based
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const { confirmOpen, onConfirm, onCancel } = useBackGuard({ allowedRoles: ['checker'], stayPath: '/DashboardChecker' });

    const loadPending = async () => {
        try {
            const { data } = await api.get('/api/inventory/pending');
            setPending(Array.isArray(data) ? data : []);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) alert('Please login as Checker/Manager to view pending items.');
            else if (status === 403) alert('Access denied: Checker/Manager only.');
            else console.warn('Pending load failed:', err?.response?.data || err?.message);
        }
    };

    const loadRecent = async () => {
        try {
            const { data } = await api.get('/api/inventory/recent');
            setRecent(Array.isArray(data) ? data : []);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) console.warn('Login required for recent.');
            else if (status === 403) console.warn('Access denied for recent.');
            else console.warn('Recent load failed:', err?.response?.data || err?.message);
        }
    };

    const loadAll = async () => {
        setLoading(true);
        await Promise.all([loadPending(), loadRecent()]).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAll();
    }, []);

    // clamp page when list or pageSize changes
    useEffect(() => {
        const total = Math.max(1, Math.ceil((recent?.length || 0) / pageSize));
        if (page > total) setPage(total);
    }, [recent, pageSize]);

    // Derived pagination values
    const totalPages = Math.max(1, Math.ceil((recent?.length || 0) / pageSize));
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pagedRecent = recent.slice(startIdx, endIdx);

    // Periodic refresh to keep lists up-to-date if others act concurrently
    useEffect(() => {
        const t = setInterval(loadAll, 15000); // 15s
        return () => clearInterval(t);
    }, []);

    const withActing = (id, fn) => async () => {
        if (acting.has(id)) return; // prevent double-click
        const next = new Set(acting);
        next.add(id);
        setActing(next);
        try {
            await fn();
            await loadAll();
        } catch (err) {
            const status = err?.response?.status;
            if (status === 404) {
                // Item likely already processed; refresh lists
                await loadAll();
                alert('This item was already processed. Refreshing list.');
            } else {
                alert(err?.response?.data?.message || err?.message || 'Operation failed');
            }
        } finally {
            const done = new Set(acting);
            done.delete(id);
            setActing(done);
        }
    };

    const approve = (id) => withActing(id, () => api.post(`/api/inventory/${id}/approve`));
    const reject = (id) => withActing(id, () => api.post(`/api/inventory/${id}/reject`));

    const openReview = async (id) => {
        try {
            const { data } = await api.get(`/api/inventory/${id}`);
            setReviewItem(data);
            setReviewOpen(true);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 404) alert('Item not found (maybe already processed).');
            else alert(err?.response?.data?.message || err.message || 'Failed to load item');
        }
    };

    const closeReview = () => {
        setReviewOpen(false);
        setReviewItem(null);
    };

    return (
        <div className="animate-fadeIn">
            <ConfirmModal
                open={confirmOpen}
                title="Leave Dashboard?"
                message="Are you sure you want to log out and return to the login page?"
                confirmText="Log Out"
                cancelText="Stay"
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
            <PageHeader
                title="Welcome, Checker!"
                description="Review pending submissions and see recent updates."
            />

            {/* --- KPI Stat Cards --- */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Pending My Approval"
                    value={pending.length}
                    icon={Clock}
                    color="text-yellow-500"
                    bgColor="bg-yellow-500/10"
                    description={loading ? 'Loading…' : 'Items needing review'}
                />
                <StatCard
                    title="Recent Submissions"
                    value={recent.length}
                    icon={FileCheck}
                    color="text-green-500"
                    bgColor="bg-green-500/10"
                    description="Latest 20 entries"
                />
                <StatCard
                    title="Active Makers"
                    value="-"
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
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Qty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Created By
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {pending.map((item) => (
                                <tr key={item.id} className="hover:bg-black/10">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                        {item.id}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.sku}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.quantity}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {item.createdBy}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="inline-flex gap-2">
                                            <button
                                                onClick={approve(item.id)}
                                                disabled={acting.has(item.id) || loading}
                                                className="rounded-md bg-green-600 px-3 py-1.5 text-xs text-white transition-all hover:bg-green-500"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={reject(item.id)}
                                                disabled={acting.has(item.id) || loading}
                                                className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white transition-all hover:bg-red-500"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => openReview(item.id)}
                                                className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs text-white transition-all hover:bg-amber-500"
                                            >
                                                Review
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pending.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">
                                        No pending items.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Recent Submissions --- */}
            <div className="mt-8 rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm">
                <div className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <FileCheck className="h-5 w-5 text-amber-500" />
                        Recent Submissions
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-black/10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Qty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Created By
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {pagedRecent.map((item) => (
                                <tr key={item.id} className="hover:bg-black/10">
                                    <td className="px-6 py-4 text-sm font-medium text-white">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {item.sku}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {item.status}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {item.createdBy}
                                    </td>
                                </tr>
                            ))}
                            {recent.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">
                                        No recent submissions.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination controls */}
                {recent.length > 0 && (
                    <div className="flex flex-col gap-3 px-6 py-3 border-t border-white/10 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-300">
                            Showing {recent.length ? startIdx + 1 : 0}-{Math.min(endIdx, recent.length)} of {recent.length}
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-300">Rows per page</label>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="rounded-md bg-white/10 px-2 py-1 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-amber-500/50"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <div className="hidden text-sm text-gray-300 sm:block">Page {page} of {totalPages}</div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="rounded-md border border-white/10 px-3 py-1 text-sm text-white/90 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="rounded-md bg-amber-600 px-3 py-1 text-sm font-medium text-black hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                        </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Review Item Modal --- */}
            {reviewOpen && reviewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-[#29190D] p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Review Item #{reviewItem.id}
                            </h3>
                            <button
                                onClick={closeReview}
                                className="text-gray-300 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-400">SKU</div>
                                <div className="text-white font-medium">
                                    {reviewItem.sku}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Name</div>
                                <div className="text-white font-medium">
                                    {reviewItem.name}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Quantity</div>
                                <div className="text-white font-medium">
                                    {reviewItem.quantity}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Unit Price</div>
                                <div className="text-white font-medium">
                                    {reviewItem.unitPrice}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-gray-400">Description</div>
                                <div className="text-white font-medium">
                                    {reviewItem.description || '-'}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Category</div>
                                <div className="text-white font-medium">
                                    {reviewItem.category || '-'}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Location</div>
                                <div className="text-white font-medium">
                                    {reviewItem.location || '-'}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Status</div>
                                <div className="text-white font-medium">
                                    {reviewItem.status}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Created By</div>
                                <div className="text-white font-medium">
                                    {reviewItem.createdBy}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Created At</div>
                                <div className="text-white font-medium">
                                    {new Date(reviewItem.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                onClick={async () => {
                                    try {
                                        await approve(reviewItem.id)();
                                        closeReview();
                                    } catch (_) {
                                        // surfaced via withActing already
                                    }
                                }}
                                disabled={acting.has(reviewItem.id) || loading}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:opacity-60"
                            >
                                Approve
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await reject(reviewItem.id)();
                                        closeReview();
                                    } catch (_) {
                                        // surfaced via withActing already
                                    }
                                }}
                                disabled={acting.has(reviewItem.id) || loading}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-60"
                            >
                                Reject
                            </button>
                            <button
                                onClick={closeReview}
                                className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckerDashboard;
