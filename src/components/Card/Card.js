export const Card = ({ children, className }) => (
  <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);
export const CardHeader = ({ children }) => <div className="px-6 py-4">{children}</div>;
export const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
export const CardDescription = ({ children }) => <p className="text-gray-600">{children}</p>;


