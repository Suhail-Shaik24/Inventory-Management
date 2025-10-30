import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    AlertTriangle,
    PackageCheck,
    PackageX,
    UserCheck,
} from "lucide-react";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";

// --- Mock Data for Dashboard ---
const stockData = [
    { name: "Apples", warehouse: 400, shelf: 240 },
    { name: "Milk", warehouse: 300, shelf: 139 },
    { name: "Bread", warehouse: 200, shelf: 980 },
    { name: "Eggs", warehouse: 278, shelf: 390 },
    { name: "Chicken", warehouse: 189, shelf: 480 },
];

const damageData = [
    { name: "Transport", value: 40 },
    { name: "Expiry", value: 30 },
    { name: "Shopping", value: 30 },
];
const DAMAGE_COLORS = ["#FF8042", "#FFBB28", "#00C49F"];

const spoilageAlerts = [
    { id: "SKU-001", name: "Organic Milk (1L)", days: 1, location: "Cooler 2" },
    { id: "SKU-078", name: "Fresh Baguette", days: 2, location: "Bakery" },
    { id: "SKU-112", name: "Strawberries (1lb)", days: 2, location: "Produce 4" },
];

const lowStockAlerts = [
    { id: "SKU-007", name: "Avocado", current: 12, min: 20, location: "Produce 1" },
    { id: "SKU-042", name: "Ground Beef", current: 8, min: 10, location: "Meat 3" },
];
// -----------------------------

const ManagerDashboard = () => {
    return (
        <div className="animate-fadeIn">
            {/* --- Page Header --- */}
            <PageHeader
                title={`Welcome, Manager!`}
                description="Here is the high-level overview of your inventory status."
            />

            {/* --- KPI Stat Cards --- */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Spoilage Alerts"
                    value={spoilageAlerts.length}
                    icon={AlertTriangle}
                    color="text-red-500"
                    bgColor="bg-red-500/10"
                    description="Items expiring in < 3 days"
                />
                <StatCard
                    title="Low Stock"
                    value={lowStockAlerts.length}
                    icon={PackageX}
                    color="text-yellow-500"
                    bgColor="bg-yellow-500/10"
                    description="Items below threshold"
                />
                <StatCard
                    title="Pending Approval"
                    value="3"
                    icon={UserCheck}
                    color="text-blue-500"
                    bgColor="bg-blue-500/10"
                    description="Awaiting checker verification"
                />
                <StatCard
                    title="Stock Total (Units)"
                    value="4,820"
                    icon={PackageCheck}
                    color="text-green-500"
                    bgColor="bg-green-500/10"
                    description="Total units in warehouse"
                />
            </div>

            {/* --- Charts --- */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Stock Levels Chart (Bar) */}
                <div
                    className="rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30
                     backdrop-blur-sm lg:col-span-2"
                >
                    <h3 className="text-lg font-semibold text-white">
                        Stock Levels (Warehouse vs. Shelf)
                    </h3>
                    <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1c1917",
                                        borderColor: "#444",
                                    }}
                                    itemStyle={{ color: "#eee" }}
                                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                                />
                                <Legend wrapperStyle={{ color: "#eee" }} />
                                <Bar dataKey="warehouse" fill="#EAB308" />
                                <Bar dataKey="shelf" fill="#D97706" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Damaged Goods Chart (Pie) */}
                <div
                    className="rounded-xl bg-[#29190D]/70 p-6 shadow-lg shadow-black/30
                     backdrop-blur-sm"
                >
                    <h3 className="text-lg font-semibold text-white">Damaged Goods</h3>
                    <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={damageData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {damageData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={DAMAGE_COLORS[index % DAMAGE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1c1917",
                                        borderColor: "#444",
                                    }}
                                    itemStyle={{ color: "#eee" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- Alert Lists --- */}
            <div
                className="mt-8 grid grid-cols-1 gap-6 rounded-xl bg-[#29190D]/70
                   p-6 shadow-lg shadow-black/30 backdrop-blur-sm md:grid-cols-2"
            >
                {/* Spoilage Alerts */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        Spoilage Alerts (Expiring Soon)
                    </h3>
                    <ul className="mt-4 max-h-60 overflow-y-auto divide-y divide-white/10 pr-2">
                        {spoilageAlerts.map((item) => (
                            <li key={item.id} className="py-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-white">{item.name}</span>
                                    <span className="text-sm text-red-400">{item.days} day(s)</span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {item.id} &middot; {item.location}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Low Stock Alerts */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-400">
                        <PackageX className="h-5 w-5" />
                        Low Stock Alerts
                    </h3>
                    <ul className="mt-4 max-h-60 overflow-y-auto divide-y divide-white/10 pr-2">
                        {lowStockAlerts.map((item) => (
                            <li key={item.id} className="py-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-white">{item.name}</span>
                                    <span className="text-sm text-yellow-400">
                                        {item.current} / {item.min}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {item.id} &middot; {item.location}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
