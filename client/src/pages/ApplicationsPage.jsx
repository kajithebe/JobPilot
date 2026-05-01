import { useEffect, useState } from 'react';
import {
  getApplications,
  createApplication,
  deleteApplication,
} from '../services/application.service.js';
import KanbanBoard from '../components/tracker/KanbanBoard.jsx';
import AddApplicationModal from '../components/tracker/AddApplicationModal.jsx';
import AddApplicationButton from '../components/tracker/AddApplicationButton.jsx';
import ApplicationDetailModal from '../components/tracker/ApplicationDetailModal.jsx';
import toast from 'react-hot-toast';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (form) => {
    const created = await createApplication(form);
    setApplications((prev) => [created, ...prev]);
    toast.success('Application added');
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete application');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleUpdate = (updated) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-xs transition ${
                view === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs transition ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Add Application
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or role..."
          className="flex-1 max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="">All stages</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {/* Board / List view */}
      <div className="flex-1 overflow-hidden">
        {view === 'kanban' ? (
          <KanbanBoard
            applications={filteredApplications}
            onApplicationClick={handleApplicationClick}
            onApplicationDelete={handleDelete}
            onApplicationAdd={() => setShowModal(true)}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <ListView
            applications={filteredApplications}
            onApplicationClick={handleApplicationClick}
            onApplicationDelete={handleDelete}
          />
        )}
      </div>

      {/* FAB */}
      <AddApplicationButton onClick={() => setShowModal(true)} />

      {/* Add application modal */}
      {showModal && (
        <AddApplicationModal onClose={() => setShowModal(false)} onSave={handleCreate} />
      )}

      {/* Application detail modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// ── List view ─────────────────────────────────────────────────────────
const ListView = ({ applications, onApplicationClick, onApplicationDelete }) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">No applications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Company</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Location</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              onClick={() => onApplicationClick(app)}
              className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
            >
              <td className="px-4 py-3 font-medium text-gray-900">{app.company}</td>
              <td className="px-4 py-3 text-gray-600">{app.role}</td>
              <td className="px-4 py-3 text-gray-400">{app.location || '—'}</td>
              <td className="px-4 py-3">
                <span className="capitalize text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {app.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {new Date(app.updated_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplicationDelete(app.id);
                  }}
                  className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsPage;
