import { useState, useEffect } from 'react';
import { updateApplication, deleteApplication } from '../../services/application.service.js';
import { getVersions } from '../../services/resume.service.js';
import api from '../../services/api.js';
import { StatusBadge } from './ApplicationCard.jsx';
import toast from 'react-hot-toast';

const ApplicationDetailModal = ({ application, onClose, onUpdate, onDelete }) => {
  const [notes, setNotes] = useState(application.notes || '');
  const [versions, setVersions] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [application.id]);

  const fetchDetails = async () => {
    try {
      const [interviewsRes, activitiesRes] = await Promise.all([
        api.get('/interviews'),
        api.get('/dashboard/activities'),
      ]);

      const appInterviews = (interviewsRes.data || []).filter(
        (i) => i.application_id === application.id
      );
      const appActivities = (activitiesRes.data || []).filter(
        (a) => a.entity_type === 'application' && a.entity_id === application.id
      );

      setInterviews(appInterviews);
      setActivities(appActivities);

      // Fetch resume versions if linked
      if (application.resume_version_id) {
        const resumeResult = await api.get(`/resumes`);
        const resumes = resumeResult.data || [];
        if (resumes.length > 0) {
          const versionsData = await getVersions(resumes[0].id);
          setVersions(versionsData || []);
        }
      }
    } catch {
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const updated = await updateApplication(application.id, { notes });
      onUpdate(updated);
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(application.id);
      onDelete(application.id);
      onClose();
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete application');
    }
  };

  const linkedVersion = versions.find((v) => v.id === application.resume_version_id);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-end z-50">
      <div className="bg-white h-full w-full max-w-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">{application.company}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{application.role}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={application.status} />
              {application.location && (
                <span className="text-xs text-gray-400">📍 {application.location}</span>
              )}
              {application.salary && (
                <span className="text-xs text-gray-400">💰 {application.salary}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            {application.job_url && (
              <a
                href={application.job_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline truncate col-span-2"
              >
                🔗 {application.job_url}
              </a>
            )}
            <div>
              <p className="text-xs text-gray-400">Applied</p>
              <p className="text-xs text-gray-700 font-medium mt-0.5">
                {application.applied_at
                  ? new Date(application.applied_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last updated</p>
              <p className="text-xs text-gray-700 font-medium mt-0.5">
                {new Date(application.updated_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Linked resume version */}
          {linkedVersion && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Linked Resume Version
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{linkedVersion.version_name}</p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  {linkedVersion.template} template ·{' '}
                  {new Date(linkedVersion.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Interviews */}
          {!loading && interviews.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Interviews ({interviews.length})
              </p>
              <div className="space-y-2">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-700 capitalize">
                        {interview.interview_type} interview
                      </p>
                      {interview.outcome && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            interview.outcome === 'offer'
                              ? 'bg-green-50 text-green-700'
                              : interview.outcome === 'rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {interview.outcome}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(interview.scheduled_at).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Add notes about this application..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300 resize-none"
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="text-xs text-blue-600 hover:text-blue-700 transition disabled:opacity-50"
              >
                {savingNotes ? 'Saving...' : 'Save notes'}
              </button>
            </div>
          </div>

          {/* Activity log */}
          {!loading && activities.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Activity
              </p>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-700 capitalize">
                        {activity.action.replace('_', ' ')}
                        {activity.metadata?.to && (
                          <span className="text-gray-400"> → {activity.metadata.to}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — delete action */}
        <div className="px-6 py-4 border-t border-gray-100">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-red-400 hover:text-red-600 transition"
            >
              Delete application
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-500">Are you sure?</p>
              <button
                onClick={handleDelete}
                className="text-xs text-red-500 hover:text-red-700 font-medium transition"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
