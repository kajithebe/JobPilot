import { useState, useEffect } from 'react';
import { updateApplication } from '../../services/application.service.js';
import { getInterviews } from '../../services/interview.service.js';
import { StatusBadge } from './ApplicationCard.jsx';
import toast from 'react-hot-toast';

const ApplicationDetailModal = ({ application, onClose, onUpdate, onDelete }) => {
  const [notes, setNotes] = useState(application.notes || '');
  const [interviews, setInterviews] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getInterviews()
      .then((data) => {
        const appInterviews = (data || []).filter((i) => i.application_id === application.id);
        setInterviews(appInterviews);
      })
      .catch(() => {});
  }, [application.id]);

  const handleNotesSave = async () => {
    setSaving(true);
    try {
      const updated = await updateApplication(application.id, { notes });
      onUpdate(updated);
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete application for ${application.role} at ${application.company}?`)) return;
    try {
      await onDelete(application.id);
      onClose();
    } catch {
      toast.error('Failed to delete application');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-end z-50">
      <div className="bg-white h-full w-full max-w-lg shadow-xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">{application.company}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{application.role}</p>
            <div className="mt-2">
              <StatusBadge status={application.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {application.location && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm text-gray-700">{application.location}</p>
              </div>
            )}
            {application.salary && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Salary</p>
                <p className="text-sm text-gray-700">{application.salary}</p>
              </div>
            )}
            {application.applied_at && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Applied</p>
                <p className="text-sm text-gray-700">
                  {new Date(application.applied_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
            {application.job_url && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Job URL</p>
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                >
                  View posting
                </a>
              </div>
            )}
          </div>

          {/* Resume version */}
          {application.resume_version_name && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Linked Resume Version</p>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <span className="text-sm text-blue-700 font-medium">
                  {application.resume_version_name}
                </span>
              </div>
            </div>
          )}

          {/* Interviews */}
          {interviews.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Interviews</p>
              <div className="space-y-2">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="text-sm text-gray-700 font-medium capitalize">
                        {interview.interview_type} interview
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(interview.scheduled_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {interview.outcome && (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          interview.outcome === 'offer'
                            ? 'bg-green-50 text-green-600'
                            : interview.outcome === 'rejected'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {interview.outcome}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesSave}
              placeholder="Add notes about this application..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300 resize-none"
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleNotesSave}
                disabled={saving}
                className="text-xs text-blue-600 hover:text-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save notes'}
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="text-xs text-gray-300 space-y-1">
            <p>
              Created:{' '}
              {new Date(application.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p>
              Last updated:{' '}
              {new Date(application.updated_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-600 transition"
          >
            Delete application
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
