/**
 * DASHBOARD PAGE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: GET /api/dashboard/stats
 * Expected response:
 * {
 *   success: true,
 *   data: {
 *     total: number,
 *     applied: number,
 *     interview: number,
 *     offer: number,
 *     rejected: number,
 *     withdrawn: number
 *   }
 * }
 *
 * BACKEND: GET /api/dashboard/alerts
 * Expected response:
 * {
 *   success: true,
 *   data: [ { id, company, role, scheduled_at, interview_type } ]
 * }
 *
 * BACKEND: GET /api/activities?page=1&limit=10
 * Expected response:
 * {
 *   success: true,
 *   data: [ { id, action, entity, entity_link, created_at } ],
 *   pagination: { total, page }
 * }
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getDashboardAlerts,
  getActivities,
} from '../services/dashboard.service.js';
import StatsCard from '../components/ui/StatsCard.jsx';
import AlertBanner from '../components/ui/AlertBanner.jsx';
import ActivityFeed from '../components/ui/ActivityFeed.jsx';
import toast from 'react-hot-toast';

const STATS_CONFIG = [
  { key: 'total', label: 'Total Applications', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'interview', label: 'Interviews', color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'offer', label: 'Offers', color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'rejected', label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

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

      {/* Overdue alert banner — hidden if no alerts */}
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
