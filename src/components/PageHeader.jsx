const PageHeader = ({ title, children }) => (
    <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {children && <p className="mt-1 text-gray-400">{children}</p>}
    </div>
);

export default PageHeader;

