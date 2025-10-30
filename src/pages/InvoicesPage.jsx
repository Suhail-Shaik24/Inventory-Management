import { useState } from 'react';
import PageHeader from '../components/PageHeader'; // Corrected path
import {
  FileText,
  Search,
  ArrowLeft,
  Download,
  Mail,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

// --- Mock Data for Invoices ---
const mockInvoices = [
  {
    id: 'INV-2024-001',
    type: 'incoming',
    supplier: 'Fresh Farms Inc.',
    date: '2024-10-28',
    status: 'Paid',
    amount: 1250.75,
    items: [
      { id: 'P1001', name: 'Organic Apples', qty: 50, cost: 75.0 },
      { id: 'P1005', name: 'Carrots (1lb bag)', qty: 100, cost: 150.0 },
      { id: 'P1009', name: 'Romaine Lettuce', qty: 75, cost: 1025.75 },
    ],
  },
  {
    id: 'INV-2024-002',
    type: 'incoming',
    supplier: 'DairyBest',
    date: '2024-10-27',
    status: 'Pending',
    amount: 820.0,
    items: [
      { id: 'P1002', name: 'Whole Milk, 1 Gal', qty: 40, cost: 320.0 },
      { id: 'P1004', name: 'Cheddar Cheese', qty: 50, cost: 500.0 },
    ],
  },
  {
    id: 'RINV-2024-001',
    type: 'reverse',
    supplier: 'Fresh Farms Inc.',
    date: '2024-10-29',
    status: 'Completed',
    amount: -75.0,
    reason: 'Damaged Goods (Transport)',
    items: [
      { id: 'P1001', name: 'Organic Apples (Damaged)', qty: -50, cost: -75.0 },
    ],
  },
  {
    id: 'INV-2024-003',
    type: 'incoming',
    supplier: 'Global Foods Ltd.',
    date: '2024-10-26',
    status: 'Paid',
    amount: 2100.0,
    items: [
      { id: 'P2001', name: 'Basmati Rice (20lb)', qty: 100, cost: 1500.0 },
      { id: 'P2002', name: 'Olive Oil (1L)', qty: 40, cost: 600.0 },
    ],
  },
];

// --- 1. Invoice List View (Main) ---
const InvoiceListView = ({ setView, setSearch, filteredInvoices, activeTab }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
      case 'Completed':
        return 'bg-green-600/20 text-green-400';
      case 'Pending':
        return 'bg-yellow-600/20 text-yellow-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm">
      {/* Search Bar */}
      <div className="border-b border-white/10 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by ID or supplier..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border-white/20 bg-white/5 p-3 pl-10 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/50"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Invoice List */}
      <div className="max-h-[60vh] overflow-y-auto">
        <ul className="divide-y divide-white/10">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <li
                key={invoice.id}
                onClick={() => setView(invoice.id)}
                className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      invoice.type === 'incoming'
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
                    <p className="font-semibold text-white">{invoice.id}</p>
                    <p className="text-sm text-gray-400">
                      {invoice.supplier}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    ${invoice.amount.toFixed(2)}
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
              No invoices found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

// --- 2. Invoice Details View ---
const InvoiceDetailsView = ({ invoiceId, onBack }) => {
  const invoice = mockInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return (
      <div className="animate-fadeIn">
        <button
          onClick={onBack}
          className="mb-4 flex items-center rounded-lg bg-white/10 p-2 text-amber-400 transition hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to list
        </button>
        <p className="text-white">Invoice not found.</p>
      </div>
    );
  }

  const simulateDownload = () => {
    alert(`Simulating PDF download for ${invoice.id}...`);
  };

  const simulateEmail = () => {
    alert(`Simulating email for ${invoice.id} to ${invoice.supplier}...`);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header & Actions */}
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 flex-shrink-0 rounded-lg bg-white/10 p-2 text-amber-400 transition hover:bg-white/20"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {invoice.id}
            </h2>
            <p className="text-gray-400">{invoice.supplier}</p>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-shrink-0 space-x-3 sm:mt-0 sm:w-auto">
          <button
            onClick={simulateEmail}
            className="flex w-1/2 items-center justify-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-gray-700 sm:w-auto"
          >
            <Mail className="mr-2 h-4 w-4" /> Send Email
          </button>
          <button
            onClick={simulateDownload}
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
            <p className="font-medium text-white">{invoice.date}</p>
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
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                        {item.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-300">
                        {item.qty}
                      </td>
                      <td className="px-3 py-4 text-right text-sm text-gray-300">
                        ${item.cost.toFixed(2)}
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
                      ${invoice.amount.toFixed(2)}
_
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
  const [view, setView] = useState('main'); // 'main' or an invoice ID
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'reverse'
  const [search, setSearch] = useState('');

  const filteredInvoices = mockInvoices.filter(
    (invoice) =>
      invoice.type === activeTab &&
      (invoice.id.toLowerCase().includes(search.toLowerCase()) ||
        invoice.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  const renderView = () => {
    if (view === 'main') {
      return (
        <InvoiceListView
          setView={setView}
          setSearch={setSearch}
          filteredInvoices={filteredInvoices}
          activeTab={activeTab}
        />
      );
    } else {
      // If view is not 'main', it's an invoice ID
      return <InvoiceDetailsView invoiceId={view} onBack={() => setView('main')} />;
    }
  };

  const tabClass = (tabName) =>
    `px-4 py-2.5 font-medium rounded-t-lg transition -mb-px
    ${
      activeTab === tabName
        ? 'border-b-2 border-amber-500 text-amber-400'
        : 'border-b-2 border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
    }`;

  return (
    <div className="animate-fadeIn">
      {/* Render PageHeader only on the main view */}
      {view === 'main' && (
        <>
          <PageHeader title="Invoice Management">
            Manage all incoming stock invoices and outgoing reverse invoices.
          </PageHeader>

          {/* Tabs */}
          <div className="border-b border-white/10">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('incoming')}
                className={tabClass('incoming')}
              >
                <FileText className="mr-2 inline h-4 w-4" />
                Incoming
              </button>
              <button
                onClick={() => setActiveTab('reverse')}
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

