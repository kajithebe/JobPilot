import OutcomeBadge from './OutcomeBadge.jsx';

const getCountdown = (scheduledAt) => {
  const now = new Date();
  const interview = new Date(scheduledAt);
  const diffMs = interview - now;

  if (diffMs < 0) return { label: 'Past', isPast: true };

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1)  return { label: 'Less than an hour', isPast: false, urgent: true };
  if (diffHours < 24) return { label: `In ${diffHours}h`, isPast: false, urgent: true };
  if (diffDays === 1) return { label: 'Tomorrow', isPast: false, urgent: true };
  return { label: `In ${diffDays} days`, isPast: false, urgent: false };
};

const TYPE_LABELS = {
  online:    'Online',
  'on-site': 'On-site',
  phone:     'Phone',
  technical: 'Technical',
  hr:        'HR',
};

const InterviewCard = ({ interview, onClick }) => {
  const countdown = getCountdown(interview.scheduled_at);

  const date = new Date(interview.scheduled_at).toLocaleDateString('en-GB', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
    year:    'numeric',
  });

  const time = new Date(interview.scheduled_at).toLocaleTimeString('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={() => onClick?.(interview)}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Company & Role */}
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {interview.company}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{interview.role}</p>

          {/* Type & Date */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[interview.interview_type] || interview.interview_type}
            </span>
            <span className="text-xs text-gray-400">{date} • {time}</span>
          </div>

          {/* Location */}
          {interview.location && (
            <p className="text-xs text-gray-400 mt-1.5">
              📍 {interview.location}
            </p>
          )}
        </div>

        {/* Right side — countdown + outcome */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {interview.outcome ? (
            <OutcomeBadge outcome={interview.outcome} />
          ) : (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              countdown.isPast
                ? 'bg-gray-100 text-gray-500'
                : countdown.urgent
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}>
              {countdown.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
