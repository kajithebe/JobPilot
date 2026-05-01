import { useState, useEffect } from 'react';
import {
  getApplications,
  createApplication,
  deleteApplication,
} from '../services/application.service.js';
import KanbanBoard from '../components/tracker/KanbanBoard.jsx';
import AddApplicationModal from '../components/tracker/AddApplicationModal.jsx';
import AddApplicationButton from '../components/tracker/AddApplicationButton.jsx';
import toast from 'react-hot-toast';

export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // BACKEND: GET /api/applications — load all applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getApplications();
        setApplications(res.data || []);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // BACKEND: POST /api/applications
  const handleSave = async (form) => {
    const res = await createApplication(form);
    setApplications((prev) => [res.data, ...prev]);
    toast.success('Application added!');
  };

  // BACKEND: DELETE /api/applications/:id — soft delete
  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete application');
    }
  };

  // BACKEND: PATCH /api/applications/:id/status
  // Called by KanbanBoard after successful API call
  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const handleApplicationClick = (app) => {
    setSelectedApp(app);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition border-none cursor-pointer"
        >
          + Add Application
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          applications={applications}
          onApplicationClick={handleApplicationClick}
          onApplicationDelete={handleDelete}
          onApplicationAdd={() => setShowModal(true)}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Floating add button — visible on mobile */}
      <AddApplicationButton onClick={() => setShowModal(true)} />

      {/* Add application modal */}
      {showModal && <AddApplicationModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      {/* Application detail modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-semibold">{selectedApp.company}</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{selectedApp.role}</p>
            {selectedApp.location && (
              <p className="inline-flex items-center gap-1 text-xs text-gray-400 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {selectedApp.location}
              </p>
            )}
            {selectedApp.salary && (
              <p className="inline-flex items-center gap-1 text-xs text-gray-400 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {selectedApp.salary}
              </p>
            )}
            {selectedApp.notes && (
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{selectedApp.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
