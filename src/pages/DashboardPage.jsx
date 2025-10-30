// import TopBar from "../components/TopBar";

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen w-full bg-brandDark bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
//       <div className="h-[60px]" />
//       {/* Top Bar */}
//       <TopBar title="Dashboard" showIcons={true} />
//       {/* Main Content */}
//       <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-start bg-transparent px-4 sm:px-0">
//         <div className="bg-brandMaroon w-full rounded-b-xl shadow-lg p-6 sm:p-8 border border-brandBeige mt-0">
//           <h2 className="font-semibold mb-4 text-white">Inventory Overview</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
//             <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
//               <p className="font-semibold">Shelf Stock</p>
//               <p className="text-2xl font-bold">8,300</p>
//             </div>
//             <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
//               <p className="font-semibold">Warehouse Stock</p>
//               <p className="text-2xl font-bold">12,450</p>
//             </div>
//             <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
//               <p className="font-semibold">Damaged Items</p>
//               <p className="text-2xl font-bold">5</p>
//             </div>
//             <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
//               <p className="font-semibold">Low Stock Alerts</p>
//               <p className="text-2xl font-bold">15</p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
//             <div className="bg-white text-brandDark p-3 sm:p-4 rounded-md shadow text-center">
//               <p className="font-semibold">Expiry Alerts</p>
//               <p className="text-2xl font-bold">12</p>
//             </div>
//           </div>
//           <h2 className="font-semibold mb-4 text-white">Quick Links</h2>
//           <div className="flex flex-wrap gap-3 sm:gap-4">
//             <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Invoices</button>
//             <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Upload Inventory</button>
//             <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Reports and Analytics</button>
//             <button className="bg-white text-brandDark px-5 sm:px-6 py-2 rounded-md shadow">Settings</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
import {
  TriangleAlert,
  CalendarClock,
  CircleOff,
  ClipboardCheck,
  ClipboardList,
  User,
} from 'lucide-react';
import StatCard from '../components/StatCard'; // Import reusable component

// --- Mock Data for Dashboard ---
const stockLevelData = [
  { name: 'Apples', warehouse: 400, shelf: 120 },
  { name: 'Oranges', warehouse: 300, shelf: 80 },
  { name: 'Milk', warehouse: 500, shelf: 150 },
  { name: 'Bread', warehouse: 200, shelf: 200 },
  { name: 'Eggs', warehouse: 600, shelf: 180 },
];
const damagedGoodsData = [
  { name: 'Transport', value: 45 },
  { name: 'Expiry', value: 80 },
  { name: 'Shopping', value: 25 },
];
const PIE_COLORS = ['#FF8042', '#FFBB28', '#00C49F'];
const alertData = [
  {
    id: 1,
    type: 'Spoilage',
    item: 'FreshYogurt (Batch 45A)',
    details: 'Expires in 2 days',
    level: 'high',
  },
  {
    id: 2,
    type: 'Low Stock',
    item: 'Organic Bananas',
    details: 'Shelf stock at 15 units (Threshold: 20)',
    level: 'medium',
  },
];
const approvalData = [
  {
    id: 1,
    maker: 'John D.',
    action: 'Uploaded new inventory file',
    timestamp: '2025-10-29 14:30',
  },
];


export default function DashboardPage() {
  const chartTextColor = '#D1D5DB'; // gray-300
  const chartGridColor = 'rgb(55 65 81)'; // gray-700
  const tooltipBg = 'rgb(31 41 55)'; // gray-800

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* 1. Key Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="High-Priority Alerts"
          value={alertData.filter((a) => a.level === 'high').length}
          unit="items"
          icon={TriangleAlert}
          color="bg-red-600"
        />
        <StatCard
          title="Pending Approvals"
          value={approvalData.length}
          unit="tasks"
          icon={ClipboardCheck}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Damaged"
          value={damagedGoodsData.reduce((acc, item) => acc + item.value, 0)}
          unit="units (24h)"
          icon={CircleOff}
          color="bg-orange-600"
        />
        <StatCard
          title="Inventory Uploads"
          value={3}
          unit="files (24h)"
          icon={ClipboardList}
          color="bg-blue-600"
        />
      </div>

      {/* 2. Charts (Stock & Damage) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Stock Level Chart */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-100">
            Stock Levels: Warehouse vs. Shelf
          </h3>
          <div className="mt-4 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevelData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGridColor}
                />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  tick={{ fill: chartTextColor }}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: chartTextColor }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                  itemStyle={{ color: chartTextColor }}
                  labelStyle={{ color: chartTextColor }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ color: chartTextColor }}
                />
                <Bar
                  dataKey="warehouse"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="shelf"
                  fill="#93C5FD"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Damaged Goods Chart */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-100">
            Damaged Goods Breakdown
          </h3>
          <div className="mt-4 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={damagedGoodsData}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                  stroke={chartGridColor}
                >
                  {damagedGoodsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                  itemStyle={{ color: chartTextColor }}
                  labelStyle={{ color: chartTextColor }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ color: chartTextColor }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Lists (Alerts & Approvals) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Alerts List */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20">
          <h3 className="mb-3 text-lg font-semibold text-gray-100">
            Active Alerts
          </h3>
          <div className="space-y-3">
            {alertData.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 rounded-lg border border-gray-700 p-3"
              >
                <div
                  className={`mt-1 rounded-full p-1.5 ${alert.type === 'Spoilage'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-yellow-900 text-yellow-300'
                    }`}
                >
                  {alert.type === 'Spoilage' ? (
                    <CalendarClock className="h-4 w-4" />
                  ) : (
                    <TriangleAlert className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-200">{alert.item}</p>
                  <p className="text-sm text-gray-400">{alert.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20">
          <h3 className="mb-3 text-lg font-semibold text-gray-100">
            Maker-Checker Approval Queue
          </h3>
          <div className="space-y-3">
            {approvalData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-700 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-700 p-2">
                    <User className="h-5 w-5 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{item.action}</p>
                    <p className="text-sm text-gray-400">
                      By: {item.maker} at {item.timestamp}
                    </p>
                  </div>
                </div>
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500">
                  Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


