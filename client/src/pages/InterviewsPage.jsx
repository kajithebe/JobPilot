/**
 * INTERVIEWS PAGE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: GET /api/interviews
 * Loads all interviews on mount.
 *
 * BACKEND: DELETE /api/interviews/:id
 * Cancels an interview when × is clicked.
 *
 * BACKEND: GET /api/interviews/:id/prep-topics
 * Loads prep topics when an interview is selected.
 *
 * Prep checklist and schedule modal wired in next commit.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { getInterviews, deleteInterview } from '../services/interview.service.js';
import ScheduleInterviewModal from '../components/tracker/ScheduleInterviewModal.jsx';
import toast from 'react-hot-toast';

// ── Interview Card ────────────────────────────────────────────
const TYPE_COLORS = {
  online: 'bg-blue-50 text-blue-600',
  'on-site': 'bg-purple-50 text-purple-600',
  phone: 'bg-green-50 text-green-600',
  technical: 'bg-orange-50 text-orange-600',
  hr: 'bg-pink-50 text-pink-600',
};

const InterviewCard = ({ interview, onClick }) => {
  const colorClass = TYPE_COLORS[interview.interview_type] || 'bg-gray-50 text-gray-600';
  const date = new Date(interview.scheduled_at);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={() => onClick(interview)}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {interview.company || '—'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{interview.role || '—'}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
              {interview.interview_type}
            </span>
            {interview.location && (
              <span className="text-xs text-gray-400">📍 {interview.location}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            📅{' '}
            {date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            at{' '}
            {date.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {/* Countdown */}
          {diffDays > 0 && (
            <p className="text-xs text-blue-500 mt-1 font-medium">
              {diffDays === 1 ? 'Tomorrow!' : `In ${diffDays} days`}
            </p>
          )}
          {diffDays === 0 && <p className="text-xs text-green-500 mt-1 font-medium">Today!</p>}
          {diffDays < 0 && <p className="text-xs text-gray-300 mt-1">Past</p>}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // BACKEND: GET /api/interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getInterviews();
        setInterviews(res.data || []);
      } catch {
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleInterviewClick = (interview) => {
    setSelectedInterview(interview);
  };

  // BACKEND: DELETE /api/interviews/:id
  const handleDeleteInterview = async (id) => {
    try {
      await deleteInterview(id);
      setInterviews((prev) => prev.filter((i) => i.id !== id));
      if (selectedInterview?.id === id) {
        const remaining = interviews.filter((i) => i.id !== id);
        setSelectedInterview(remaining.length > 0 ? remaining[0] : null);
      }
      toast.success('Interview cancelled');
    } catch {
      toast.error('Failed to cancel interview');
    }
  };

  const handleScheduleSave = (interview) => {
    setInterviews((prev) => [interview, ...prev]);
    setSelectedInterview(interview);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition border-none cursor-pointer"
        >
          + Schedule Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm mb-4">No interviews scheduled yet</p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition border-none cursor-pointer"
          >
            Schedule your first interview
          </button>
        </div>
      ) : (
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Left — interview list */}
          <div className="w-80 flex-shrink-0 overflow-y-auto space-y-3">
            {interviews.map((interview) => (
              <div key={interview.id} className="relative group">
                <div
                  className={`rounded-xl transition ${
                    selectedInterview?.id === interview.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <InterviewCard interview={interview} onClick={handleInterviewClick} />
                </div>
                <button
                  onClick={() => handleDeleteInterview(interview.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Right — detail panel placeholder — prep checklist added next commit */}
          {selectedInterview && (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedInterview.company || '—'}
                </h2>
                <p className="text-gray-500 text-sm">{selectedInterview.role || '—'}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                  <span>
                    📅{' '}
                    {new Date(selectedInterview.scheduled_at).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span>
                    🕐{' '}
                    {new Date(selectedInterview.scheduled_at).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {selectedInterview.location && <span>📍 {selectedInterview.location}</span>}
                </div>
                {selectedInterview.notes && (
                  <p className="text-xs text-gray-400 mt-2 italic">{selectedInterview.notes}</p>
                )}
                <p className="text-sm text-gray-400 text-center mt-8">
                  Prep checklist coming in next commit...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule modal */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          applicationId={null}
          company="—"
          role="—"
          onClose={() => setShowScheduleModal(false)}
          onSave={handleScheduleSave}
        />
      )}
    </div>
  );
};

export default InterviewsPage;
