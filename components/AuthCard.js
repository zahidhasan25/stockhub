export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <a href="/" className="mb-6 block text-center text-lg font-bold text-brand-700">
          StockHub
        </a>
        <h1 className="text-center text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-gray-500">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
