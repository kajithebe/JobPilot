/**
 * PIPELINE FUNNEL BAR CHART
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Data comes from GET /api/dashboard/charts
 * Uses: data.pipelineFunnel
 *
 * Each data point: { stage: string, count: number }
 * ─────────────────────────────────────────────────────────────
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const STAGE_COLORS = {
  wishlist: '#94a3b8',
  applied: '#2563eb',
  interview: '#7c3aed',
  offer: '#16a34a',
  rejected: '#dc2626',
  withdrawn: '#f59e0b',
};

const PipelineBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline Funnel</h2>
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">Pipeline Funnel</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="stage"
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
          <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Applications">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STAGE_COLORS[entry.stage?.toLowerCase()] || '#2563eb'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PipelineBarChart;
