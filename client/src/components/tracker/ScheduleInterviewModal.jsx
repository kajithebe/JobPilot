/**
 * SCHEDULE INTERVIEW MODAL
 * ─────────────────────────────────────────────────────────────
 * BACKEND: POST /api/interviews
 * Request:
 * {
 *   application_id: number,
 *   interview_type: string,  ← online | on-site | phone | technical | hr
 *   scheduled_at: string,    ← ISO datetime string
 *   location: string,
 *   notes: string
 * }
 *
 * Expected success response (201):
 * {
 *   success: true,
 *   data: { id, application_id, interview_type, scheduled_at, location, notes }
 * }
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { createInterview } from '../../services/interview.service.js';
import toast from 'react-hot-toast';

const INTERVIEW_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'on-site', label: 'On-site' },
  { value: 'phone', label: 'Phone' },
  { value: 'technical', label: 'Technical' },
  { value: 'hr', label: 'HR' },
];

const ScheduleInterviewModal = ({ applicationId, company, role, onClose, onSave }) => {
  const [form, setForm] = useState({
    interview_type: 'online',
    scheduled_at: '',
    location: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.scheduled_at) return toast.error('Please select a date and time');

    setSaving(true);
    try {
      const interview = await createInterview({
        application_id: applicationId,
        ...form,
      });
      toast.success('Interview scheduled!');
      onSave(interview);
      onClose();
    } catch {
      toast.error('Failed to schedule interview');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-gray-900 font-semibold">Schedule Interview</h3>
            {company && role && (
              <p className="text-xs text-gray-400 mt-0.5">
                {company} — {role}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Interview type */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Interview Type</label>
            <div className="flex flex-wrap gap-2">
              {INTERVIEW_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleChange('interview_type', type.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                    form.interview_type === type.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date and time */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => handleChange('scheduled_at', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location / Link</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Google Meet link or office address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any notes about this interview..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
