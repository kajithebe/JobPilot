/**
 * ALERT BANNER COMPONENT
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Data comes from GET /api/dashboard/alerts
 * Shows overdue interviews that have passed without a check-in.
 *
 * Receives: alerts[] — array of overdue interview objects
 * Each alert: { id, company, role, scheduled_at, interview_type }
 * ─────────────────────────────────────────────────────────────
 */

import { Link } from 'react-router-dom';

const AlertBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        {/* Warning icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <span className="text-amber-600 text-sm">⚠️</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-800 mb-1">
            {alerts.length} overdue interview{alerts.length !== 1 ? 's' : ''} need a check-in
          </h3>

          {/* Alert list */}
          <div className="space-y-1">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-2">
                <span className="text-xs text-amber-700">
                  {alert.company} — {alert.role}
                </span>
                <span className="text-xs text-amber-500">
                  ({alert.interview_type} ·{' '}
                  {new Date(alert.scheduled_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  )
                </span>
              </div>
            ))}
          </div>

          {/* Link to interviews page */}
          <Link
            to="/interviews"
            className="inline-block mt-2 text-xs font-medium text-amber-700 hover:text-amber-900 hover:underline"
          >
            Go to Interviews →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
