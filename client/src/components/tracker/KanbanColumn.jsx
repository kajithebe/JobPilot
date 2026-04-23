import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// ── Sortable card wrapper ─────────────────────────────────────────────
const SortableCard = ({ application, onApplicationClick, onApplicationDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ApplicationCard
        application={application}
        onClick={onApplicationClick}
        onDelete={onApplicationDelete}
      />
    </div>
  );
};

// ── Kanban Column ─────────────────────────────────────────────────────
const KanbanColumn = ({
  status,
  applications,
  onApplicationClick,
  onApplicationDelete,
  onApplicationAdd,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

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

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl p-2 transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-gray-50'
        }`}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {applications.length === 0 ? (
              <EmptyState
                status={status}
                onAdd={status === 'wishlist' ? onApplicationAdd : undefined}
              />
            ) : (
              applications.map((app) => (
                <SortableCard
                  key={app.id}
                  application={app}
                  onApplicationClick={onApplicationClick}
                  onApplicationDelete={onApplicationDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
