import bg from "../assets/background.avif";
import TopBar from "../components/TopBar";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-brandDark bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="h-[60px]" />
      {/* Top Bar */}
      <TopBar title="Dashboard" showIcons={true} />
      {/* Main Content */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-start bg-transparent px-4 sm:px-0">
        <div className="bg-brandMaroon w-full rounded-b-xl shadow-lg p-6 sm:p-8 border border-brandBeige mt-0">
          <h2 className="font-semibold mb-4 text-white">Inventory Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
              <p className="font-semibold">Shelf Stock</p>
              <p className="text-2xl font-bold">8,300</p>
            </div>
            <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
              <p className="font-semibold">Warehouse Stock</p>
              <p className="text-2xl font-bold">12,450</p>
            </div>
            <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
              <p className="font-semibold">Damaged Items</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
              <p className="font-semibold">Low Stock Alerts</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
              <p className="font-semibold">Expiry Alerts</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
          <h2 className="font-semibold mb-4 text-white">Quick Links</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Invoices</button>
            <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Upload Inventory</button>
            <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Reports and Analytics</button>
            <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
