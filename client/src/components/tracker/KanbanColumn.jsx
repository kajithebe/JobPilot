import ApplicationCard from './ApplicationCard.jsx';
import EmptyState from './EmptyState.jsx';

const COLUMN_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const COLUMN_COLORS = {
  wishlist: 'bg-gray-100 text-gray-600',
  applied: 'bg-blue-100 text-blue-600',
  interview: 'bg-purple-100 text-purple-600',
  offer: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
  withdrawn: 'bg-orange-100 text-orange-600',
};

const KanbanColumn = ({
  status,
  applications,
  onApplicationClick,
  onApplicationDelete,
  onApplicationAdd,
}) => {
  return (
    <div className="flex flex-col flex-shrink-0 w-72">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">{COLUMN_LABELS[status]}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${COLUMN_COLORS[status]}`}>
            {applications.length}
          </span>
        </div>
      </div>

      {/* Basic column body — DnD added in next commit */}
      <div className="flex-1 min-h-[200px] rounded-xl p-2 bg-gray-50">
        <div className="space-y-2">
          {applications.length === 0 ? (
            <EmptyState
              status={status}
              onAdd={status === 'wishlist' ? onApplicationAdd : undefined}
            />
          ) : (
            applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onClick={onApplicationClick}
                onDelete={onApplicationDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
