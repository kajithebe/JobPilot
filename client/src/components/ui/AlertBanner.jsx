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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-600"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
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
