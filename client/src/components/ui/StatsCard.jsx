/**
 * STATS CARD COMPONENT
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Data comes from GET /api/dashboard/stats
 * Receives: label, value, color, bg
 * ─────────────────────────────────────────────────────────────
 */

const StatsCard = ({ label, value, color, bg }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${bg}`}>
          <span className={`text-lg font-bold ${color}`}>{value ?? '—'}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default StatsCard;
