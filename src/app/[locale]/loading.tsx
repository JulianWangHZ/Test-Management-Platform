export default function Loading() {
  return (
    <div className="px-6 py-8 max-w-6xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-24 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 h-36" />
        ))}
      </div>
    </div>
  );
}
