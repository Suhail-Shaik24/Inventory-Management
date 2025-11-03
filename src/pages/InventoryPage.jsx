import { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import bwipjs from "bwip-js";
import { api } from '../api/client';
import { Dialog } from "@headlessui/react";
import { NavLink } from 'react-router-dom';
import {
    Package,
    PlusSquare,
    LayoutGrid,
    Truck,
    UploadCloud,
    QrCode,
    ArrowRight,
    ArrowLeft,
    FileText,
    User,
    List,
} from 'lucide-react';
import JsBarcode from 'jsbarcode';

// --- Reusable Sub-Page Header ---
// This component provides a title and a "Back" button for each function
const SubPageHeader = ({ title, onBack }) => (
    <div className="mb-6 flex items-center">
        <button
            onClick={onBack}
            className="mr-4 flex-shrink-0 rounded-lg bg-white/10 p-2 text-amber-400 transition hover:bg-white/20"
            aria-label="Go back"
        >
            <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="truncate text-2xl font-semibold text-white">{title}</h2>
    </div>
);

// --- 1. Main Inventory Grid (Default View) ---
const InventoryGrid = ({ setView }) => {
    const inventoryOptions = [
        {
            title: 'Manage Products',
            description: 'Edit, delete, or view all products.',
            icon: Package,
            view: 'manageProducts',
        },
        {
            title: 'Add New Stock',
            description: 'Log new inventory arrivals.',
            icon: PlusSquare,
            view: 'addStock',
        },
        
        {
            title: 'Upload Inventory File',
            description: 'Bulk upload stock via CSV/file feed.',
            icon: UploadCloud,
            view: 'uploadFile',
        },
        {
            title: 'Barcode Generation',
            description: 'Create and print product barcodes.',
            icon: QrCode,
            view: 'barcode',
        },
    ];

    return (
        <div className="animate-fadeIn">
            <PageHeader
                title="Inventory"
                description="Select a function to manage your inventory."
            />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {inventoryOptions.map((option) => (
                    <button
                        key={option.title}
                        onClick={() => setView(option.view)}
                        className="group flex flex-col justify-between rounded-xl
            bg-[#29190D]/70 p-6 text-left shadow-lg shadow-black/30
            backdrop-blur-sm transition-all
            hover:bg-white/10 hover:shadow-amber-900/40"
                    >
                        <div>
                            <div
                                className="flex h-12 w-12 items-center justify-center
                rounded-lg bg-amber-600/20 text-amber-500"
                            >
                                <option.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-white">
                                {option.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                                {option.description}
                            </p>
                        </div>
                        <div
                            className="mt-4 flex items-center text-sm font-medium
              text-amber-500 transition-all
              group-hover:translate-x-1 group-hover:text-amber-400"
                        >
                            Go to section <ArrowRight className="ml-1.5 h-4 w-4" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- 2. Manage Products View ---
const ManageProductsView = ({ setView }) => {
    const mockProducts = [
        { id: 'P1001', name: 'Organic Apples', category: 'Produce', stock: 150 },
        { id: 'P1002', name: 'Whole Milk, 1 Gal', category: 'Dairy', stock: 80 },
        { id: 'P1003', name: 'Sourdough Bread', category: 'Bakery', stock: 45 },
        { id: 'P1004', name: 'Cheddar Cheese', category: 'Dairy', stock: 60 },
    ];

    return (
        <div className="animate-fadeIn">
            <SubPageHeader title="Manage Products" onBack={() => setView('main')} />
            <div className="overflow-hidden rounded-xl bg-[#29190D]/70 shadow-lg shadow-black/30 backdrop-blur-sm">
                <ul className="divide-y divide-white/10">
                    {mockProducts.map((product) => (
                        <li
                            key={product.id}
                            className="flex items-center justify-between p-4"
                        >
                            <div>
                                <p className="font-semibold text-white">{product.name}</p>
                                <p className="text-sm text-gray-400">
                                    {product.id} • {product.category}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-white">{product.stock}</p>
                                <p className="text-sm text-gray-400">in stock</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// --- 3. Add New Stock View ---
// --- 3. Add New Stock View ---
const AddStockView = ({ setView }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Produce',
    count: '',
    cost: '',
    expiryDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // popup flag

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const qty = Number(formData.count);
    const price = Number(formData.cost);
    if (!formData.productName.trim() || qty <= 0 || price <= 0) {
      alert('Please enter valid details');
      return;
    }

    const payload = {
      sku:
        `${formData.productName}`.trim().toUpperCase().replace(/\s+/g, '-') +
        '-' +
        Date.now(),
      name: formData.productName.trim(),
      quantity: qty,
      unitPrice: price,
      description: formData.expiryDate
        ? `Expiry: ${formData.expiryDate}`
        : '',
      category: formData.category,
      location: 'A1',
    };

    try {
      setSubmitting(true);
      await api.post('/api/inventory', payload);
      setShowSuccess(true); // open modal instead of alert
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        'Submission failed';
      alert(`Failed to submit: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 block w-full rounded-lg border-white/20 bg-white/5 p-3 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/50';

  return (
    <div className="animate-fadeIn">
      <SubPageHeader title="Add New Stock" onBack={() => setView('main')} />
      <div className="rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Produce</option>
              <option>Dairy</option>
              <option>Bakery</option>
              <option>Pantry</option>
              <option>Frozen</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Count
              </label>
              <input
                type="number"
                name="count"
                value={formData.count}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Total Cost
              </label>
              <input
                type="number"
                name="cost"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>
          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit New Stock'}
            </button>
          </div>
        </form>
      </div>

      {/* Success popup modal */}
      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-md w-full rounded-2xl bg-[#1f120a] p-6 text-white shadow-xl border border-amber-500/30">
            <Dialog.Title className="text-xl font-semibold text-amber-400">
              New Stock Submitted!
            </Dialog.Title>
            <p className="mt-2 text-gray-300">
              Your new stock <strong>{formData.productName}</strong> has been successfully submitted.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSuccess(false)}
                className="rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600"
              >
                Close
              </button>
              <NavLink to="/my-submissions">
              <button
                onClick={() => setView('MySubmissions')}
                className="rounded-md bg-amber-600 px-4 py-2 font-medium hover:bg-amber-700"
              >
                View My Submissions
              </button>
                </NavLink>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

// --- 6. Upload File View ---
const UploadFileView = ({ setView }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }
        console.log('Uploading file:', selectedFile.name);
        // Simulate file upload
        alert(`File "${selectedFile.name}" uploaded! (See console)`);
        setSelectedFile(null);
        setView('main');
    };

    return (
        <div className="animate-fadeIn">
            <SubPageHeader
                title="Upload Inventory File"
                onBack={() => setView('main')}
            />
            <div className="rounded-xl bg-[#29190D]/70 p-6 text-center shadow-lg shadow-black/30 backdrop-blur-sm">
                <div
                    className="relative mt-4 flex justify-center rounded-lg border-2
          border-dashed border-white/25 px-6 pb-10 pt-8"
                >
                    <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-500" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-semibold text-amber-500 hover:text-amber-400"
                            >
                                <span>Upload a file</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept=".csv"
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500">CSV up to 10MB</p>
                    </div>
                </div>

                {selectedFile && (
                    <p className="mt-4 text-sm text-white">
                        Selected file: <strong>{selectedFile.name}</strong>
                    </p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="mt-6 rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white shadow-md transition
           hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50
           disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Upload File
                </button>
            </div>
        </div>
    );
};

// --- 7. Barcode Generation View ---
const BarcodeView = ({ setView }) => {
    const [productId, setProductId] = useState("");
    const [error, setError] = useState("");
    const canvasRef = useRef(null);

    const handleGenerate = (e) => {
        e.preventDefault();
        setError("");

        if (!productId) {
            setError("Please enter a Product ID.");
            return;
        }

        try {
            // Generate barcode on the <canvas> element
            bwipjs.toCanvas(canvasRef.current, {
                bcid: "code128",        // Barcode type (Code128 works for most cases)
                text: productId,        // Text to encode
                scale: 3,               // 3x scaling
                height: 10,             // Bar height (mm)
                includetext: true,      // Show human-readable text
                textxalign: "center",   // Center align text
            });
        } catch (err) {
            setError("Failed to generate barcode. Please check the Product ID.");
            console.error(err);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30 backdrop-blur-sm">
                <form onSubmit={handleGenerate} className="flex space-x-4">
                    <input
                        type="text"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        placeholder="Enter Product ID (e.g., P1001)"
                        className="block w-full rounded-lg border-white/20 bg-white/5 p-3 text-white
              shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/50"
                        required
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white shadow-md transition
              hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                        Generate
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-red-400 text-center font-medium">{error}</p>
                )}

                <div className="mt-8 text-center">
                    <canvas ref={canvasRef} className="mx-auto bg-white p-4 rounded-lg" />
                    {productId && (
                        <button
                            onClick={() => window.print()}
                            className="mt-4 rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-gray-700"
                        >
                            Print
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};



// --- Main Exported Component ---
const InventoryPage = () => {
    const [view, setView] = useState('main'); // 'main' is the grid

    const renderView = () => {
        switch (view) {
            case 'manageProducts':
                return <ManageProductsView setView={setView} />;
            case 'addStock':
                return <AddStockView setView={setView} />;
            case 'manageCategories':
                return <ManageCategoriesView setView={setView} />;
            case 'suppliers':
                return <SuppliersView setView={setView} />;
            case 'uploadFile':
                return <UploadFileView setView={setView} />;
            case 'barcode':
                return <BarcodeView setView={setView} />;
            case 'main':
            default:
                return <InventoryGrid setView={setView} />;
        }
    };

    return (
        <div key={view} className="animate-fadeIn">
            {renderView()}
        </div>
    );
};

export default InventoryPage;

