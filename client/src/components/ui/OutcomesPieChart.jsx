/**
 * INTERVIEW OUTCOMES PIE CHART
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Data comes from GET /api/dashboard/charts
 * Uses: data.interviewOutcomes
 *
 * Each data point: { outcome: string, count: number }
 * ─────────────────────────────────────────────────────────────
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OUTCOME_COLORS = {
  offer: '#16a34a',
  rejected: '#dc2626',
  waiting: '#f59e0b',
};

const OutcomesPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Interview Outcomes</h2>
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">Interview Outcomes</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="outcome"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={35}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={OUTCOME_COLORS[entry.outcome?.toLowerCase()] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            formatter={(value, name) => [value, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'capitalize' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutcomesPieChart;
