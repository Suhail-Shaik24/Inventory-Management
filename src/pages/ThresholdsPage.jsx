import PageHeader from '../components/PageHeader';

export default function ThresholdsPage() {
    return (
        <div className="p-4 md:p-8">
            <PageHeader title="Stock Threshold Alerts">
                Manage and receive alerts when stock levels fall below a set threshold.
            </PageHeader>
            <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
                <h2 className="text-xl font-semibold text-white">
                    Set Alert Rules (Placeholder)
                </h2>
                <p className="text-gray-400">
                    This page would allow administrators to set, view, and edit the
                    low-stock thresholds for each product.
                </p>
            </div>
        </div>
    );
}


