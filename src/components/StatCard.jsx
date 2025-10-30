const StatCard = ({ title, value, icon, unit, color }) => {
    const IconComponent = icon;
    return (
        <div className="flex-1 rounded-xl bg-gray-800 p-4 shadow-lg shadow-black/20 transition-all hover:bg-gray-700/60">
            <div className="flex items-center space-x-3">
                <div className={`rounded-full p-3 ${color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="text-2xl font-semibold text-white">
                        {value} <span className="text-base font-normal">{unit}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;