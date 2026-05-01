/**
 * APPLICATIONS LINE CHART
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Data comes from GET /api/dashboard/charts
 * Uses: data.applicationsOverTime
 *
 * Each data point: { date: string, count: number }
 * ─────────────────────────────────────────────────────────────
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const ApplicationsLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Applications Over Time</h2>
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">Applications Over Time</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 3 }}
            activeDot={{ r: 5 }}
            name="Applications"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationsLineChart;
