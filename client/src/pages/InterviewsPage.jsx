/**
 * INTERVIEWS PAGE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: GET /api/interviews
 * BACKEND: DELETE /api/interviews/:id
 * BACKEND: GET /api/interviews/:id/prep-topics
 * BACKEND: POST /api/interviews/:id/prep-topics — { topic: string }
 * BACKEND: PATCH /api/interviews/:id/prep-topics/:topicId — { is_completed: bool }
 * BACKEND: DELETE /api/interviews/:id/prep-topics/:topicId
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import {
  getInterviews,
  deleteInterview,
  getPrepTopics,
  createPrepTopic,
  updatePrepTopic,
  deletePrepTopic,
} from '../services/interview.service.js';
import ScheduleInterviewModal from '../components/tracker/ScheduleInterviewModal.jsx';
import InterviewCard from '../components/tracker/InterviewCard.jsx';
import OutcomeBadge from '../components/tracker/OutcomeBadge.jsx';
import PrepChecklist from '../components/tracker/PrepChecklist.jsx';
import toast from 'react-hot-toast';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // BACKEND: GET /api/interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getInterviews();
        setInterviews(data || []);
      } catch {
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  // BACKEND: GET /api/interviews/:id/prep-topics
  const selectedInterviewId = selectedInterview?.id;
  useEffect(() => {
    if (!selectedInterviewId) return;
    const fetchTopics = async () => {
      setTopicsLoading(true);
      try {
        const data = await getPrepTopics(selectedInterviewId);
        setTopics(data || []);
      } catch {
        toast.error('Failed to load prep topics');
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, [selectedInterviewId]);

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

  // BACKEND: POST /api/interviews/:id/prep-topics
  const handleAddTopic = async (topic) => {
    try {
      const data = await createPrepTopic(selectedInterview.id, topic);
      setTopics((prev) => [...prev, data]);
    } catch {
      toast.error('Failed to add topic');
    }
  };

  // BACKEND: PATCH /api/interviews/:id/prep-topics/:topicId
  const handleToggleTopic = async (topicId, is_completed) => {
    try {
      const data = await updatePrepTopic(selectedInterview.id, topicId, { is_completed });
      setTopics((prev) => prev.map((t) => (t.id === topicId ? data : t)));
    } catch {
      toast.error('Failed to update topic');
    }
  };

  // BACKEND: DELETE /api/interviews/:id/prep-topics/:topicId
  const handleDeleteTopic = async (topicId) => {
    try {
      await deletePrepTopic(selectedInterview.id, topicId);
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
    } catch {
      toast.error('Failed to delete topic');
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
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-lg leading-none border-none bg-transparent cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Right — interview detail + prep checklist */}
          {selectedInterview && (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                {/* Interview detail header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedInterview.company || '—'}
                    </h2>
                    {selectedInterview.outcome && (
                      <OutcomeBadge outcome={selectedInterview.outcome} />
                    )}
                  </div>
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
                </div>

                <hr className="border-gray-100 mb-6" />

                {/* Prep checklist */}
                {topicsLoading ? (
                  <p className="text-gray-400 text-sm text-center py-4">Loading topics...</p>
                ) : (
                  <PrepChecklist
                    topics={topics}
                    onAdd={handleAddTopic}
                    onToggle={handleToggleTopic}
                    onDelete={handleDeleteTopic}
                  />
                )}
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
