import { useState } from 'react';

const STATUS_STYLES = {
  wishlist: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  applied: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  interview: { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
  offer: { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
  withdrawn: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-400' },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.wishlist;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ApplicationCard = ({ application, onClick, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(application.id);
  };

  return (
    <div
      onClick={() => onClick(application)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Company & Role */}
          <h3 className="text-sm font-semibold text-gray-900 truncate">{application.company}</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{application.role}</p>

          {/* Location & Salary */}
          <div className="flex flex-wrap gap-2 mt-2">
            {application.location && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {application.location}
              </span>
            )}
            {application.salary && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {application.salary}
              </span>
            )}
          </div>

          {/* Status badge */}
          <div className="mt-3">
            <StatusBadge status={application.status} />
          </div>

          {/* Date */}
          <p className="text-xs text-gray-300 mt-2">
            {new Date(application.updated_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Delete button */}
        {showDelete && onDelete && (
          <button
            onClick={handleDelete}
            className="text-gray-300 hover:text-red-400 transition text-lg leading-none flex-shrink-0"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export { StatusBadge };
export default ApplicationCard;
