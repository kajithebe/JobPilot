/**
 * ACTIVITY FEED COMPONENT
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Data comes from GET /api/activities
 * Shows paginated list of recent user actions.
 *
 * Each activity: {
 *   id: number,
 *   action: string,      ← e.g. "Applied to", "Interview scheduled at"
 *   entity: string,      ← e.g. company name
 *   entity_link: string, ← e.g. /job-tracker
 *   created_at: string
 * }
 * ─────────────────────────────────────────────────────────────
 */

import { Link } from 'react-router-dom';

const ACTION_ICONS = {
  applied: '📨',
  interview: '🎯',
  offer: '🎉',
  rejected: '💪',
  withdrawn: '↩️',
  created: '✨',
  updated: '✏️',
  deleted: '🗑️',
  default: '📋',
};

const getIcon = (action) => {
  const key = Object.keys(ACTION_ICONS).find((k) => action?.toLowerCase().includes(k));
  return ACTION_ICONS[key] || ACTION_ICONS.default;
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const ActivityFeed = ({ activities, loading, onLoadMore, hasMore }) => {
  if (loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-400 text-center py-8">Loading activity...</p>
      </div>
    );
  }

  if (!loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-400 text-center py-8">
          No activity yet — start by adding an application!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">{getIcon(activity.action)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                {activity.action}{' '}
                {activity.entity_link ? (
                  <Link
                    to={activity.entity_link}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {activity.entity}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">{activity.entity}</span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{formatTime(activity.created_at)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="w-full mt-4 py-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition border border-gray-200 disabled:opacity-50 cursor-pointer bg-transparent"
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
