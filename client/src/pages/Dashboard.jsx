export default function Dashboard() {
  const stats = [
    { label: 'Total Applications', value: '—', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Interviews', value: '—', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Offers', value: '—', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rejected', value: '—', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">Welcome back! Here's your job search overview.</p>

      {/* Stats cards — placeholder until GET /api/dashboard/stats is ready */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg} mb-3`}
            >
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Activity feed — placeholder until GET /api/activities is ready */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-400 text-center py-8">
          Activity feed coming soon — will connect to GET /api/activities
        </p>
      </div>
    </div>
  );
}
