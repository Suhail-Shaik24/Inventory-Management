import React, { useEffect, useMemo, useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../api/client';
import ConfirmModal from '../components/ConfirmModal.jsx';
import useBackGuard from '../hooks/useBackGuard.jsx';
import StatCard from '../components/StatCard';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ClipboardCheck, Boxes, Package, AlertTriangle, TrendingDown, Wrench, XCircle, RefreshCw } from 'lucide-react';
import Toast from '../components/Toast.jsx';

// Manager maps to Admin dashboard view; enforce role and back-protection here if needed
export default function ManagerDashboard() {
    const { confirmOpen, onConfirm, onCancel } = useBackGuard({ allowedRoles: ['manager'], stayPath: '/manager-dashboard' });

    // Legacy recent list state (kept as-is)
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // First-load vs background-refresh flags (to prevent chart unmount/remount)
    const [firstLoad, setFirstLoad] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Stock summary (warehouse/shelf)
    const [summary, setSummary] = useState({
        totals: { warehouse: 0, shelf: 0, combined: 0 },
        pie: { warehouse: 0, shelf: 0 },
        categories: [],
    });

    // Inventory stats (expired/low/damaged/trend)
    const [invStats, setInvStats] = useState(null);
    const [statsError, setStatsError] = useState('');

    // Forms
    const [mode, setMode] = useState('add'); // 'add' | 'set'
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('');
    const [item, setItem] = useState('');
    const [qty, setQty] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [checking, setChecking] = useState(false);
    const [availableQty, setAvailableQty] = useState(null);
    const [threshold, setThreshold] = useState(10);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('info');
    const [toastMsg, setToastMsg] = useState('');
    const [useSku, setUseSku] = useState(false);
    const [sku, setSku] = useState('');
    const debounceRef = useRef();
    const midnightTimer = useRef(null);

    // Load stock summary
    const loadSummary = async () => {
        if (!firstLoad) setRefreshing(true);
        try {
            const { data } = await api.get('/api/stock/summary');
            const totals = data?.totals || { warehouse: 0, shelf: 0, combined: 0 };
            const pie = data?.pie || { warehouse: totals.warehouse || 0, shelf: totals.shelf || 0 };
            const categories = Array.isArray(data?.categories) ? data.categories : [];
            setSummary({ totals, pie, categories });
        } catch (e) {
            console.warn('loadSummary failed', e);
        } finally {
            if (firstLoad) setFirstLoad(false);
            setRefreshing(false);
        }
    };

    // Load inventory stats (expired/low/damaged/trend)
    const loadInvStats = async () => {
        if (!firstLoad) setRefreshing(true);
        setStatsError('');
        try {
            const { data } = await api.get('/api/inventory/stats', { params: { threshold } });
            setInvStats(data || null);
        } catch (primaryErr) {
            // Optional fallback to separate endpoints if available
            try {
                const [expiredRes, lowRes, damRes] = await Promise.allSettled([
                    api.get('/api/inventory/expired/count'),
                    api.get('/api/inventory/lowstock/count'),
                    api.get('/api/inventory/damaged/count'),
                ]);
                const expired = expiredRes.status === 'fulfilled' ? Number(expiredRes.value?.data || 0) : 0;
                const lowStock = lowRes.status === 'fulfilled' ? Number(lowRes.value?.data || 0) : 0;
                const damaged = damRes.status === 'fulfilled' ? Number(damRes.value?.data || 0) : 0;
                setInvStats({ approved: 0, pending: 0, rejected: 0, expired, lowStock, damaged, nearExpiring: 0, lowStockTrend: [] });
            } catch (fallbackErr) {
                console.warn('loadInvStats failed', primaryErr);
                setStatsError('Failed to load inventory stats');
                setInvStats(null);
            }
        } finally {
            if (firstLoad) setFirstLoad(false);
            setRefreshing(false);
        }
    };

    // Load categories (fallback to names from summary)
    const loadCategories = async () => {
        try {
            const { data } = await api.get('/api/inventory/categories');
            if (Array.isArray(data) && data.length) {
                setCategories(data);
                return;
            }
            const names = [...new Set((summary.categories || []).map((c) => c.category))]
                .filter(Boolean)
                .map((name, idx) => ({ id: idx + 1, name }));
            setCategories(names);
        } catch (e) {
            const names = [...new Set((summary.categories || []).map((c) => c.category))]
                .filter(Boolean)
                .map((name, idx) => ({ id: idx + 1, name }));
            setCategories(names);
        }
    };

    // Load items for selected category
    const loadItems = async (cat) => {
        setItems([]);
        if (!cat) return;
        try {
            const { data } = await api.get('/api/inventory/items', { params: { category: cat } });
            if (Array.isArray(data)) setItems(data);
        } catch (e) {
            setItems([]);
        }
    };

    // Recent submissions
    const loadRecent = async () => {
        try {
            const { data } = await api.get('/api/inventory/recent');
            setRecent(Array.isArray(data) ? data : []);
        } catch (e) {
            setRecent([]);
        }
    };

    const loadAll = async () => {
        setLoading(true);
        await Promise.all([loadSummary(), loadInvStats(), loadRecent()]).finally(() => setLoading(false));
        await loadCategories();
    };

    useEffect(() => {
        loadAll();
    }, []);

    useEffect(() => {
        setItem('');
        loadItems(category);
    }, [category]);

    // Pagination calculations (recent)
    const pageCount = Math.max(1, Math.ceil(recent.length / ITEMS_PER_PAGE));
    useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
    useEffect(() => { setPage(1); }, [recent.length]);
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, recent.length);
    const currentItems = recent.slice(startIdx, endIdx);

    // Colors and chart helpers
    const PIE_COLORS = ['#3B82F6', '#10B981']; // warehouse, shelf
    const chartTextColor = '#D1D5DB';
    const chartGridColor = 'rgb(55 65 81)';
    const tooltipBg = 'rgb(31 41 55)';

    // Derived datasets
    const wsPieData = useMemo(() => ([
        { name: 'Warehouse', value: summary?.pie?.warehouse || 0 },
        { name: 'Shelf', value: summary?.pie?.shelf || 0 },
    ]), [summary]);

    const wsBarData = useMemo(() => (
        (summary?.categories || []).map((c) => ({ name: c.category, warehouse: c.warehouseQty || 0, shelf: c.shelfQty || 0 }))
    ), [summary]);

    // Validate item availability in warehouse for shelf operations
    const validateShelfAvailability = async (selectedCategory, selectedItem, q, forSetMode = false) => {
        try {
            setChecking(true);
            setFormError('');
            const params = useSku && sku ? { sku } : { category: selectedCategory, item: selectedItem };
            const { data } = await api.get('/api/inventory/warehouse/exists', { params });
            const exists = !!data?.exists;
            const available = Number(data?.availableQuantity ?? 0);
            setAvailableQty(available);
            if (!exists) {
                setFormError('Item not found in warehouse. Cannot add to shelf.');
                return { ok: false };
            }
            if (!forSetMode) {
                if (!Number.isFinite(q) || q <= 0) {
                    setFormError('Quantity must be a positive number.');
                    return { ok: false };
                }
                if (available <= 0) {
                    setFormError('Stock not available in warehouse');
                    return { ok: false };
                }
                if (q > available) {
                    setFormError(`Requested quantity exceeds available warehouse stock (Available: ${available} units).`);
                    return { ok: false };
                }
            }
            return { ok: true, available };
        } catch (e) {
            setFormError(e?.response?.data?.error || 'Failed to validate warehouse availability.');
            return { ok: false };
        } finally {
            setChecking(false);
        }
    };

    // Toast trigger helper
    const triggerToast = (type, msg) => { setToastType(type); setToastMsg(msg); setShowToast(true); };

    // Effect: whenever formError is set (and not currently checking/saving), show toast
    useEffect(() => {
        if (formError && !checking && !saving) {
            triggerToast('error', formError);
        }
    }, [formError, checking, saving]);

    // Auto validate when user changes shelf inputs (debounced)
    useEffect(() => {
        const qNum = Number(qty);
        if (useSku) {
            if (!sku) return; // need sku
        } else {
            if (!category || !item) return;
        }
        if (!Number.isFinite(qNum) || qNum <= 0) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const selectedCategory = useSku ? undefined : (categories.find(c => String(c.id) === String(category))?.name || categories.find(c => String(c.name) === String(category))?.name || category);
            const selectedItem = useSku ? undefined : (items.find(it => String(it.id) === String(item))?.name || items.find(it => String(it.name) === String(item))?.name || item);
            validateShelfAvailability(selectedCategory, selectedItem, qNum, String(mode).toLowerCase() === 'set');
        }, 400);
        return () => debounceRef.current && clearTimeout(debounceRef.current);
    }, [category, item, sku, qty, mode, useSku]);

    // Submit stock change
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        const q = Number(qty);
        if (useSku) {
            if (!sku) { setFormError('Enter a SKU.'); return; }
        } else {
            if (!category) { setFormError('Select a category.'); return; }
            if (!item) { setFormError('Select an item.'); return; }
        }
        if (!Number.isFinite(q) || q <= 0) { setFormError('Quantity must be a positive number.'); return; }

        const payload = {
            category: useSku ? undefined : (categories.find(c => String(c.name) === String(category))?.name || category),
            item: useSku ? undefined : (items.find(it => String(it.name) === String(item))?.name || item),
            quantity: q,
            mode,
        };

        const res = await validateShelfAvailability(payload.category, payload.item, q, String(mode).toLowerCase() === 'set');
        if (!res.ok) return;

        setSaving(true);
        try {
            await api.post('/api/stock/shelf', useSku ? { ...payload, sku } : payload);
            const successMsg = String(mode).toLowerCase() === 'set' ? 'Stock updated successfully.' : 'Stock added successfully.';
            triggerToast('success', successMsg);
            setQty(''); if (useSku) setSku('');
            await Promise.all([loadSummary(), loadInvStats()]);
        } catch (e) {
            triggerToast('error', e?.response?.data?.message || e?.response?.data?.error || 'Failed to update shelf stock.');
        } finally { setSaving(false); }
    };

    // animate only on the first render of charts
    const animate = firstLoad;

    const handleManualRefresh = async () => {
        try {
            await Promise.all([loadSummary(), loadInvStats(), loadRecent()]);
        } catch (e) {
            // ignore
        }
    };

    const scheduleMidnightRefresh = () => {
        if (midnightTimer.current) clearTimeout(midnightTimer.current);
        try {
            const now = new Date();
            const next = new Date(now);
            // schedule at 00:05 next day local time
            next.setDate(now.getDate() + 1);
            next.setHours(0, 5, 0, 0);
            const ms = Math.max(60_000, next.getTime() - now.getTime());
            midnightTimer.current = setTimeout(async () => {
                await loadInvStats();
                scheduleMidnightRefresh(); // reschedule for the following day
            }, ms);
        } catch (_) { /* ignore */ }
    };

    useEffect(() => {
        // Listen for cross-tab storage updates
        const onStorage = (e) => {
            if (e?.key === 'inventory:updated') {
                loadInvStats();
            }
        };
        window.addEventListener('storage', onStorage);
        // Listen for same-tab custom event
        const onCustom = () => loadInvStats();
        window.addEventListener('inventory:updated', onCustom);
        // Schedule midnight refresh so naturally-expiring items reflect without reload
        scheduleMidnightRefresh();
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('inventory:updated', onCustom);
            if (midnightTimer.current) clearTimeout(midnightTimer.current);
        };
    }, []);

    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Global toast */}
            <Toast open={showToast} type={toastType} message={toastMsg} onClose={() => setShowToast(false)} />

            <ConfirmModal
                open={confirmOpen}
                title="Leave Dashboard?"
                message="Are you sure you want to log out and return to the login page?"
                confirmText="Log Out"
                cancelText="Stay"
                onConfirm={onConfirm}
                onCancel={onCancel}
            />

            <PageHeader title="Manager Dashboard" description="Manage warehouse & shelf stock and view live distribution." />

            {statsError && (
                <div className="rounded-lg bg-red-600/20 p-3 text-sm text-red-200 ring-1 ring-red-600/30">{statsError}</div>
            )}

            {/* 2x2 Cards layout */}
            {firstLoad ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-xl bg-white/10" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Warehouse" value={summary?.totals?.warehouse ?? 0} unit="qty" icon={Boxes} color="bg-blue-600" />
                    <StatCard title="Shelf" value={summary?.totals?.shelf ?? 0} unit="qty" icon={Package} color="bg-green-600" />
                    <StatCard title="Expired" value={invStats?.expired ?? 0} unit="items" icon={XCircle} color="bg-red-600" />
                    <StatCard title="Low/Damaged" value={(invStats?.lowStock ?? 0) + (invStats?.damaged ?? 0)} unit="items" icon={TrendingDown} color="bg-amber-500" />
                </div>
            )}

            {/* Optional tiny updating hint */}
            {!firstLoad && refreshing && (
                <div className="text-xs text-gray-400">Updating…</div>
            )}

            {/* Alerts banner */}
            {(invStats?.nearExpiring > 0 || (invStats?.lowStock || 0) > 0 || (invStats?.damaged || 0) > 0) && (
                <div className="rounded-lg bg-black/30 p-4 ring-1 ring-white/10">
                    {invStats?.nearExpiring > 0 && (
                        <div className="mb-2 flex items-center text-sm text-amber-300"><AlertTriangle className="mr-2 h-4 w-4" /> {invStats.nearExpiring} items expiring within 7 days.</div>
                    )}
                    {(invStats?.lowStock || 0) > 0 && (
                        <div className="mb-2 flex items-center text-sm text-amber-300"><TrendingDown className="mr-2 h-4 w-4" /> {invStats.lowStock} items below stock threshold.</div>
                    )}
                    {(invStats?.damaged || 0) > 0 && (
                        <div className="flex items-center text-sm text-gray-300"><Wrench className="mr-2 h-4 w-4" /> {invStats.damaged} damaged items reported.</div>
                    )}
                </div>
            )}

            {/* Stock forms */}
            <div className="rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm ring-1 ring-white/10">
                <div className="px-6 pt-6">
                    <h3 className="text-2xl font-semibold text-gray-100">Add to Shelf</h3>
                    {formError && (
                        <div className="mt-2 rounded-md border border-red-500/40 bg-red-600/15 px-3 py-2 text-xs text-red-200">
                            {formError}
                        </div>
                    )}
                </div>
                <div className="px-4 py-4">
                    {/* Threshold & Mode Row */}
                    <div className="flex flex-wrap gap-4 items-center text-xs text-gray-300">
                        <label className="flex items-center gap-2">Low-stock threshold:
                            <input type="number" min="1" value={threshold} onChange={(e)=>setThreshold(Number(e.target.value)||10)} className="w-20 rounded bg-gray-800 px-2 py-1 text-gray-100" />
                            <button type="button" onClick={handleManualRefresh} className="rounded bg-black/40 px-2 py-1 hover:bg-black/60">Apply</button>
                        </label>
                        <label className="flex items-center gap-2 ml-auto">Use SKU instead of Category/Item:
                            <input type="checkbox" checked={useSku} onChange={(e)=>{setUseSku(e.target.checked); setFormError('');}} />
                        </label>
                        {useSku && (
                            <input placeholder="SKU" value={sku} onChange={(e)=>setSku(e.target.value)} className="rounded bg-gray-800 px-3 py-2 text-gray-100" />
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-5">
                    {/* Category selector */}
                    <div className="md:col-span-1">
                        <label className="mb-1 block text-xs text-gray-300">Category</label>
                        {categories.length > 0 ? (
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100">
                                <option value="">Select</option>
                                {categories.map((c) => (
                                    <option key={c.id ?? c.name} value={c.id ?? c.name}>{c.name ?? c}</option>
                                ))}
                            </select>
                        ) : (
                            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category name" className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100" />
                        )}
                    </div>

                    {/* Item selector */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs text-gray-300">Item</label>
                        {items.length > 0 ? (
                            <select value={item} onChange={(e) => setItem(e.target.value)} className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100" disabled={!category}>
                                <option value="">Select</option>
                                {items.map((it) => (
                                    <option key={it.id ?? it.name} value={it.id ?? it.name}>{it.name ?? it}</option>
                                ))}
                            </select>
                        ) : (
                            <input value={item} onChange={(e) => setItem(e.target.value)} placeholder="Item or SKU" className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100" disabled={!category} />
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="mb-1 block text-xs text-gray-300">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            placeholder="e.g., 25"
                            className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100"
                        />
                        {/* Availability info (shelf only) */}
                        <div className="mt-1 text-xs">
                            {checking && <span className="text-gray-400">Checking availability…</span>}
                            {!checking && availableQty !== null && formError.startsWith('Requested quantity exceeds') === false && formError.startsWith('Item not found') === false && (
                                <span className="text-gray-300">Available in warehouse: <span className="text-gray-100 font-semibold">{availableQty}</span></span>
                            )}
                        </div>
                    </div>

                    {/* Mode */}
                    <div>
                        <label className="mb-1 block text-xs text-gray-300">Mode</label>
                        <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100">
                            <option value="add">Add (increment)</option>
                            <option value="set">Set (override)</option>
                        </select>
                    </div>

                    <div className="md:col-span-5 flex justify-end">
                        <button type="submit" disabled={saving || checking} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-500 disabled:opacity-60">
                            {saving ? 'Saving…' : checking ? 'Validating…' : `Save Shelf Stock`}
                        </button>
                    </div>
                </form>
            </div>

            {/* Charts: Warehouse vs Shelf + per-category stacked bar */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Pie */}
                <div className="min-w-0 rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30 backdrop-blur-sm ring-1 ring-white/10 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-100">Warehouse vs Shelf</h3>
                    <div className="mt-4 h-96 w-full">
                        {firstLoad ? (
                            <div className="h-full w-full animate-pulse rounded-lg bg-white/10" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%" debounce={150}>
                                <PieChart>
                                    <Pie
                                        data={wsPieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        dataKey="value"
                                        nameKey="name"
                                        label={(e) => `${e.name}: ${e.value}`}
                                        labelLine={false}
                                        stroke={chartGridColor}
                                        isAnimationActive={animate}
                                    >
                                        {wsPieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }} itemStyle={{ color: chartTextColor }} labelStyle={{ color: chartTextColor }} />
                                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ color: chartTextColor }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="min-w-0 rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30 backdrop-blur-sm ring-1 ring-white/10 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-100">Stock by Category (Warehouse vs Shelf)</h3>
                    <div className="mt-4 h-96 w-full">
                        {firstLoad ? (
                            <div className="h-full w-full animate-pulse rounded-lg bg-white/10" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%" debounce={150}>
                                <BarChart data={wsBarData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} tick={{ fill: chartTextColor }} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: chartTextColor }} />
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }} itemStyle={{ color: chartTextColor }} labelStyle={{ color: chartTextColor }} />
                                    <Legend />
                                    <Bar dataKey="warehouse" stackId="a" fill={PIE_COLORS[0]} name="Warehouse" radius={[4,4,0,0]} isAnimationActive={animate} />
                                    <Bar dataKey="shelf" stackId="a" fill={PIE_COLORS[1]} name="Shelf" radius={[4,4,0,0]} isAnimationActive={animate} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Inventory Submissions (unchanged) */}
            <div className="rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm ring-1 ring-white/10">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-white">Recent Inventory Submissions</h3>
                    <p className="mt-1 text-sm text-gray-400">Latest activity across the system</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-black/10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Submitted By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Date</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                        {currentItems.map((item) => (
                            <tr key={item.id || item.sku} className="hover:bg-black/10">
                                <td className="px-6 py-4 text-sm text-gray-300">{item.sku}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{item.category || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{item.status}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{item.createdBy || item.submittedBy || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                        {currentItems.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">No recent items.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination footer */}
                <div className="flex flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row">
                    <div className="text-sm text-gray-400">
                        {recent.length > 0 ? (
                            <span>
                Showing <span className="text-gray-200">{startIdx + 1}</span>–<span className="text-gray-200">{endIdx}</span> of <span className="text-gray-200">{recent.length}</span>
              </span>
                        ) : (
                            <span>Nothing to display</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-lg bg-black/30 px-4 py-2 text-sm font-medium text-gray-200 ring-1 ring-white/10 transition hover:bg-black/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-2 text-sm text-gray-400">Page <span className="text-gray-200">{page}</span> / {pageCount}</span>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                            disabled={page === pageCount || recent.length === 0}
                            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
