import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../api/client';
import { Box } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const statusColor = {
  PENDING: 'text-yellow-400 bg-yellow-500/10',
  APPROVED: 'text-green-400 bg-green-500/10',
  REJECTED: 'text-red-400 bg-red-500/10',
};

const MySubmissions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const location = useLocation();

  // Filters & pagination state
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | PENDING | APPROVED | REJECTED
  const [query, setQuery] = useState(''); // search in sku/name
  const [fromDate, setFromDate] = useState(''); // YYYY-MM-DD
  const [toDate, setToDate] = useState(''); // YYYY-MM-DD
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/inventory/me');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load my submissions:', err?.response?.data || err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived: filtered items per controls
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = fromDate ? new Date(fromDate + 'T00:00:00').getTime() : -Infinity;
    const toTs = toDate ? new Date(toDate + 'T23:59:59.999').getTime() : Infinity;

    return items.filter((i) => {
      if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
      if (q) {
        const hay = (i.sku || '').toLowerCase() + ' ' + (i.name || '').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const created = i.createdAt ? new Date(i.createdAt).getTime() : 0;
      if (created < fromTs || created > toTs) return false;
      return true;
    });
  }, [items, statusFilter, query, fromDate, toDate]);

  // Clamp page when filters/pageSize change
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize) || 1);
  useEffect(() => {
    setPage(1);
  }, [statusFilter, query, fromDate, toDate, pageSize]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  // When items/filters load, if a highlight is requested, navigate to its page and scroll
  useEffect(() => {
    const requested = location?.state?.highlightId;
    if (!requested) return;
    const id = Number(requested);
    if (!id) return;

    const idx = filtered.findIndex((i) => Number(i.id) === id);
    if (idx === -1) return; // filtered out or not found

    const targetPage = Math.floor(idx / pageSize) + 1;
    if (page !== targetPage) {
      setPage(targetPage);
      // delay scroll to next effect when pageItems update
      return;
    }

    // On correct page: set highlight and scroll
    setHighlightId(id);
    setTimeout(() => {
      const el = document.getElementById(`submission-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const t = setTimeout(() => setHighlightId(null), 4000);
    return () => clearTimeout(t);
  }, [filtered, page, pageSize, location]);

  const clearFilters = () => {
    setStatusFilter('ALL');
    setQuery('');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader title="My Submissions" description="All inventory items you submitted (pending, approved, rejected)." />

      <div className="mt-8 rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Box className="h-5 w-5 text-amber-500" />
            My Submissions
          </h3>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
            <div>
              <label className="block text-xs text-gray-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full rounded-md border-white/20 bg-white/5 p-2 text-sm text-black focus:border-amber-500 focus:ring-amber-500/50"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400">Search (SKU or Name)</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., APPLES or SKU-123"
                className="mt-1 w-full rounded-md border-white/20 bg-white/5 p-2 text-sm text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 w-full rounded-md border-white/20 bg-white/5 p-2 text-sm text-white [color-scheme:dark] focus:border-amber-500 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 w-full rounded-md border-white/20 bg-white/5 p-2 text-sm text-white [color-scheme:dark] focus:border-amber-500 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Showing <span className="text-white">{Math.min(filtered.length, pageStart + 1)}</span>-
              <span className="text-white">{Math.min(filtered.length, pageStart + pageItems.length)}</span> of
              <span className="text-white"> {filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="rounded-md bg-white/10 px-3 py-1.5 text-gray-200 hover:bg-white/20"
              >
                Clear Filters
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border-white/20 bg-white/5 p-1.5 text-black focus:border-amber-500 focus:ring-amber-500/50"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
               </div>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {pageItems.map((item) => (
                <tr
                  id={`submission-${item.id}`}
                  key={item.id}
                  className={`hover:bg-black/10 ${highlightId === Number(item.id) ? 'ring-2 ring-amber-400 bg-white/5 rounded-md' : ''}`}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{item.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{item.sku}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{item.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{item.quantity}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColor[item.status] || 'bg-white/10 text-gray-300'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-300">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md bg-white/10 px-3 py-1.5 disabled:opacity-50 hover:bg-white/20"
          >
            Prev
          </button>
          <div>
            Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-md bg-white/10 px-3 py-1.5 disabled:opacity-50 hover:bg-white/20"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySubmissions;

