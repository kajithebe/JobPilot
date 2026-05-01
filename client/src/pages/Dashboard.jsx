/**
 * DASHBOARD PAGE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: GET /api/dashboard/stats
 * BACKEND: GET /api/dashboard/alerts
 * BACKEND: GET /api/activities?page=1&limit=10
 * BACKEND: GET /api/dashboard/charts?range=30|60|90
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getDashboardAlerts,
  getActivities,
} from '../services/dashboard.service.js';
import { getChartData } from '../services/charts.service.js';
import StatsCard from '../components/ui/StatsCard.jsx';
import AlertBanner from '../components/ui/AlertBanner.jsx';
import ActivityFeed from '../components/ui/ActivityFeed.jsx';
import ApplicationsLineChart from '../components/ui/ApplicationsLineChart.jsx';
import PipelineBarChart from '../components/ui/PipelineBarChart.jsx';
import OutcomesPieChart from '../components/ui/OutcomesPieChart.jsx';
import toast from 'react-hot-toast';

const STATS_CONFIG = [
  { key: 'total', label: 'Total Applications', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'interview', label: 'Interviews', color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'offer', label: 'Offers', color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'rejected', label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50' },
];

const DATE_RANGES = [
  { label: '30 days', value: 30 },
  { label: '60 days', value: 60 },
  { label: '90 days', value: 90 },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState(30);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // BACKEND: GET /api/dashboard/stats and GET /api/dashboard/alerts
  useEffect(() => {
    const fetchStatsAndAlerts = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          getDashboardStats(),
          getDashboardAlerts(),
        ]);
        setStats(statsRes.data);
        setAlerts(alertsRes.data || []);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStatsAndAlerts();
  }, []);

  // BACKEND: GET /api/activities?page=1&limit=10
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const res = await getActivities(1, 10);
        setActivities(res.data || []);
        setHasMore(res.pagination ? res.pagination.page * 10 < res.pagination.total : false);
      } catch {
        toast.error('Failed to load activity feed');
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // BACKEND: GET /api/dashboard/charts?range=30|60|90
  // Refetches whenever range changes
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setChartsLoading(true);
        const res = await getChartData(range);
        setChartData(res.data);
      } catch {
        toast.error('Failed to load chart data');
      } finally {
        setChartsLoading(false);
      }
    };
    fetchCharts();
  }, [range]);

  // Load more activities — pagination
  const handleLoadMore = async () => {
    try {
      setActivitiesLoading(true);
      const nextPage = activitiesPage + 1;
      const res = await getActivities(nextPage, 10);
      setActivities((prev) => [...prev, ...(res.data || [])]);
      setActivitiesPage(nextPage);
      setHasMore(res.pagination ? nextPage * 10 < res.pagination.total : false);
    } catch {
      toast.error('Failed to load more activities');
    } finally {
      setActivitiesLoading(false);
    }
  };

  return (
    <div>
      {/* Welcome message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your job search overview.</p>
      </div>

      {/* Overdue alert banner */}
      <AlertBanner alerts={alerts} />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS_CONFIG.map((config) => (
          <StatsCard
            key={config.key}
            label={config.label}
            value={statsLoading ? '...' : (stats?.[config.key] ?? 0)}
            color={config.color}
            bg={config.bg}
          />
        ))}
      </div>

      {/* Date range filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Charts</h2>
        <div className="flex items-center gap-2">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer ${
                range === r.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {chartsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-64 flex items-center justify-center"
            >
              <p className="text-sm text-gray-400">Loading chart...</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <ApplicationsLineChart data={chartData?.applicationsOverTime || []} />
          <PipelineBarChart data={chartData?.pipelineFunnel || []} />
          <OutcomesPieChart data={chartData?.interviewOutcomes || []} />
        </div>
      )}

      {/* Activity feed */}
      <ActivityFeed
        activities={activities}
        loading={activitiesLoading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      />
    </div>
  );
}
