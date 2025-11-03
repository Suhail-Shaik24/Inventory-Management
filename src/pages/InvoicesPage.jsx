import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  FileText,
  Search,
  ArrowLeft,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from '../api/client';
import LogoUrl from '../assets/Logo_Icon.svg';

// Helper formatters
const displayId = (inv) => inv?.externalId || (inv?.id != null ? `INV-${inv.id}` : '');
const displayDate = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
};

// Convert an image URL (svg/png) to data URL for jsPDF; fallback to null
const toPngDataUrl = async (url) => {
  try {
    // fetch and draw to canvas
    const res = await fetch(url);
    const blob = await res.blob();
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(blob);
    });
    const canvas = document.createElement('canvas');
    const maxH = 40; // keep it small
    const ratio = img.width ? (maxH / img.height) : 1;
    canvas.width = img.width ? Math.round(img.width * ratio) : 40;
    canvas.height = img.height ? Math.round(img.height * ratio) : maxH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    URL.revokeObjectURL(img.src);
    return { dataUrl, width: canvas.width, height: canvas.height };
  } catch {
    return null;
  }
};

// --- 1. Invoice List View (Main) ---
const InvoiceListView = ({ onSelect, setSearch, filteredInvoices, activeTab, loading, error, page, totalPages, onPrev, onNext, statusFilter, setStatusFilter }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
      case 'Completed':
      case 'APPROVED':
        return 'bg-green-600/20 text-green-400';
      case 'Pending':
      case 'PENDING':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'REJECTED':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm">
      {/* Search + Filters */}
      <div className="border-b border-white/10 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-1/2">
            <input
              type="text"
              placeholder="Search by ID or supplier..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border-white/20 bg-white/5 p-3 pl-10 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/50"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-amber-500/50"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        {loading && <p className="mt-2 text-sm text-gray-400">Loading invoices…</p>}
        {error && !loading && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {/* Invoice List */}
      <div className="max-h-[60vh] overflow-y-auto">
        <ul className="divide-y divide-white/10">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <li
                key={invoice.id || invoice.externalId}
                onClick={() => onSelect(invoice)}
                className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${invoice.type === 'incoming'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-red-600/20 text-red-400'
                      }`}
                  >
                    {invoice.type === 'incoming' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{displayId(invoice)}</p>
                    <p className="text-sm text-gray-400">
                      {invoice.supplier}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {`$${Number(invoice.amount || 0).toFixed(2)}`}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-400">
              {loading ? 'Loading…' : 'No invoices found.'}
            </li>
          )}
        </ul>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 0}
          className="rounded-lg bg-black/30 px-4 py-2 text-sm font-medium text-gray-200 ring-1 ring-white/10 transition hover:bg-black/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">Page <span className="text-gray-200">{page + 1}</span> / {Math.max(1, totalPages)}</span>
        <button
          type="button"
          onClick={onNext}
          disabled={page + 1 >= totalPages}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// --- 2. Invoice Details View ---
const InvoiceDetailsView = ({ invoice, onBack }) => {
  if (!invoice) {
    return (
      <div className="animate-fadeIn">
        <button
          onClick={onBack}
          className="mb-4 flex items-center rounded-lg bg-white/10 p-2 text-amber-400 transition hover:bg-white/20"
        >
          Back to list
        </button>
        <p className="text-white">Invoice not found.</p>
      </div>
    );
  }

  const onDownloadPdf = async () => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      let cursorY = 40;

      // Branded Header
      const logo = await toPngDataUrl(LogoUrl);
      if (logo) {
        doc.addImage(logo.dataUrl, 'PNG', marginX, cursorY - 10, logo.width, logo.height);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Inventory Management', logo ? marginX + logo.width + 12 : marginX, cursorY + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('www.example.com', pageWidth - marginX - doc.getTextWidth('www.example.com'), cursorY + 8);
      cursorY += 30;
      doc.setDrawColor(230);
      doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
      cursorY += 20;

      // Invoice Title / Meta
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(20);
      doc.text(`Invoice ${displayId(invoice)}`, marginX, cursorY);
      cursorY += 22;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Supplier: ${invoice.supplier ?? ''}`, marginX, cursorY);
      const dateLabel = `Date: ${displayDate(invoice.date)}`;
      doc.text(dateLabel, pageWidth - marginX - doc.getTextWidth(dateLabel), cursorY);
      cursorY += 16;

      doc.text(`Status: ${invoice.status ?? ''}`, marginX, cursorY);
      const typeLabel = `Type: ${invoice.type ?? ''}`;
      doc.text(typeLabel, pageWidth - marginX - doc.getTextWidth(typeLabel), cursorY);
      if (invoice.reason) {
        cursorY += 16;
        doc.text(`Reason: ${invoice.reason}`, marginX, cursorY);
      }

      // Items table
      const head = [['Item', 'Qty', 'Cost']];
      const body = (invoice.items || []).map((it) => [
        it.name,
        String(it.qty),
        `$${Number(it.cost || 0).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: cursorY + 24,
        head,
        body,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [245, 158, 11], textColor: 0 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX, right: marginX },
      });

      const afterTableY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || (cursorY + 24);

      // Totals block
      const totalText = `Total: $${Number(invoice.amount || 0).toFixed(2)}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(totalText, pageWidth - marginX - doc.getTextWidth(totalText), afterTableY + 24);

      // Footer
      doc.setDrawColor(230);
      doc.line(marginX, doc.internal.pageSize.getHeight() - 60, pageWidth - marginX, doc.internal.pageSize.getHeight() - 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text('Thank you for your business.', marginX, doc.internal.pageSize.getHeight() - 40);
      doc.text('For questions, contact support@example.com', marginX, doc.internal.pageSize.getHeight() - 26);

      doc.save(`${displayId(invoice)}.pdf`);
    } catch (e) {
      console.error('PDF generation error', e);
      alert('Unable to generate PDF. Please try again.');
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header & Actions */}
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 flex-shrink-0 rounded-lg bg-white/10 px-3 py-2 text-amber-400 transition hover:bg-white/20"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {displayId(invoice)}
            </h2>
            <p className="text-gray-400">{invoice.supplier}</p>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-shrink-0 space-x-3 sm:mt-0 sm:w-auto">
          <button
            onClick={onDownloadPdf}
            className="flex w-1/2 items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-amber-700 sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30 backdrop-blur-sm sm:p-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="font-medium text-white">{invoice.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date</p>
            <p className="font-medium text-white">{displayDate(invoice.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="font-medium capitalize text-white">{invoice.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Reason</p>
            <p className="font-medium text-white">
              {invoice.reason || 'N/A'}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-white"
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {(invoice.items || []).map((item) => (
                    <tr key={item.id || item.sku || item.name}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                        {item.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-300">
                        {item.qty}
                      </td>
                      <td className="px-3 py-4 text-right text-sm text-gray-300">
                        {`$${Number(item.cost || 0).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      scope="row"
                      colSpan="2"
                      className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-white sm:pl-0"
                    >
                      Total
                    </th>
                    <td className="px-3 pt-4 text-right text-base font-semibold text-white">
                      {`$${Number(invoice.amount || 0).toFixed(2)}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Exported Component ---
export default function InvoicesPage() {
  const [view, setView] = useState('main'); // 'main' or 'details'
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'reverse'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Server-side pagination
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchInvoices = async (type, st, pg, sz) => {
    setLoading(true);
    try {
      const params = { type, page: pg, size: sz };
      if (st && st !== 'ALL') params.status = st;
      const { data } = await api.get('/api/invoices', { params });
      const content = Array.isArray(data) ? data : (data?.content || []);
      setItems(content);
      setTotalPages(Number.isFinite(data?.totalPages) ? data.totalPages : 1);
      setError('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load invoices');
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + on filter/tab/page/size change
  useEffect(() => {
    fetchInvoices(activeTab, statusFilter, page, size);
  }, [activeTab, statusFilter, page, size]);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(() => fetchInvoices(activeTab, statusFilter, page, size), 30000);
    return () => clearInterval(id);
  }, [activeTab, statusFilter, page, size]);

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((inv) => {
      const idText = displayId(inv).toLowerCase();
      const supplier = (inv.supplier || '').toLowerCase();
      return idText.includes(q) || supplier.includes(q);
    });
  }, [items, search]);

  const onPrev = () => setPage((p) => Math.max(0, p - 1));
  const onNext = () => setPage((p) => (p + 1 < totalPages ? p + 1 : p));

  const renderView = () => {
    if (view === 'main') {
      return (
        <InvoiceListView
          onSelect={(inv) => { setSelected(inv); setView('details'); }}
          setSearch={setSearch}
          filteredInvoices={filteredInvoices}
          activeTab={activeTab}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onPrev={onPrev}
          onNext={onNext}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setPage(0); setStatusFilter(val); }}
        />
      );
    } else {
      return <InvoiceDetailsView invoice={selected} onBack={() => setView('main')} />;
    }
  };

  const tabClass = (tabName) =>
    `px-4 py-2.5 font-medium rounded-t-lg transition -mb-px
    ${activeTab === tabName
      ? 'border-b-2 border-amber-500 text-amber-400'
      : 'border-b-2 border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
    }`;

  return (
    <div className="animate-fadeIn">
      {view === 'main' && (
        <>
          <PageHeader title="Invoice Management">
            Manage all incoming stock invoices and outgoing reverse invoices.
          </PageHeader>

          {/* Tabs */}
          <div className="border-b border-white/10">
            <nav className="flex space-x-2">
              <button
                onClick={() => { setActiveTab('incoming'); setPage(0); }}
                className={tabClass('incoming')}
              >
                <FileText className="mr-2 inline h-4 w-4" />
                Incoming
              </button>
              <button
                onClick={() => { setActiveTab('reverse'); setPage(0); }}
                className={tabClass('reverse')}
              >
                <FileText className="mr-2 inline h-4 w-4" />
                Reverse
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Render current view */}
      <div className={view === 'main' ? 'mt-6' : ''}>{renderView()}</div>
    </div>
  );
}
