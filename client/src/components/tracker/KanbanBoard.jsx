import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn.jsx';
import ApplicationCard from './ApplicationCard.jsx';
import { updateApplicationStatus } from '../../services/application.service.js';
import toast from 'react-hot-toast';

const PIPELINE = ['wishlist', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'];

const ALLOWED_TRANSITIONS = {
  wishlist: ['applied', 'withdrawn'],
  applied: ['interview', 'rejected', 'withdrawn'],
  interview: ['offer', 'rejected', 'withdrawn'],
  offer: ['withdrawn'],
  rejected: [],
  withdrawn: [],
};

const KanbanBoard = ({
  applications,
  onApplicationClick,
  onApplicationDelete,
  onApplicationAdd,
  onStatusChange,
}) => {
  const [activeApp, setActiveApp] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const getColumnApps = (status) => applications.filter((app) => app.status === status);

  const handleDragStart = ({ active }) => {
    const app = applications.find((a) => a.id === active.id);
    setActiveApp(app || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveApp(null);
    if (!over) return;

    const app = applications.find((a) => a.id === active.id);
    if (!app) return;

    const newStatus = over.id;
    if (newStatus === app.status) return;
    if (!PIPELINE.includes(newStatus)) return;

    // Validate transition
    if (!ALLOWED_TRANSITIONS[app.status].includes(newStatus)) {
      toast.error(`Cannot move from "${app.status}" to "${newStatus}"`);
      return;
    }

    try {
      await updateApplicationStatus(app.id, newStatus);
      onStatusChange(app.id, newStatus);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {PIPELINE.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={getColumnApps(status)}
            onApplicationClick={onApplicationClick}
            onApplicationDelete={onApplicationDelete}
            onApplicationAdd={onApplicationAdd}
          />
        ))}
      </div>

      {/* Drag overlay — shows card while dragging */}
      <DragOverlay>
        {activeApp ? (
          <div className="opacity-90 rotate-1 scale-105">
            <ApplicationCard application={activeApp} onClick={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
