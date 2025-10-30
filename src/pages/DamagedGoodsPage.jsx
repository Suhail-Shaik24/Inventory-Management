import PageHeader from '../components/PageHeader';

export default function DamagedGoodsPage() {
    return (
        <div className="p-4 md:p-8">
            <PageHeader title="Damaged Goods Tracking">
                Categorize and identify damaged goods by their cause.
            </PageHeader>
            <div className="rounded-xl bg-gray-800 p-6 shadow-lg shadow-black/20">
                <h2 className="text-xl font-semibold text-white">
                    Damage Report (Placeholder)
                </h2>
                <p className="text-gray-400">
                    Charts and forms for reporting damage (Transport, Shopping, Expiry)
                    would be here.
                </p>
            </div>
        </div>
    );
}


