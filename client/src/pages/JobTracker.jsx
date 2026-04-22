/**
 * JOB TRACKER PAGE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: GET /api/applications — loads all applications on mount
 * BACKEND: POST /api/applications — creates new application
 * BACKEND: PATCH /api/applications/:id/status — drag to new column
 * BACKEND: DELETE /api/applications/:id — soft delete
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { getApplications, deleteApplication } from '../services/application.service.js';
import toast from 'react-hot-toast';

export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition border-none cursor-pointer">
          + Add Application
        </button>
      </div>

      {/* Kanban board placeholder — wired in later commit */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-400 text-sm">Kanban board coming next...</p>
      </div>
    </div>
  );
}
