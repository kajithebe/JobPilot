import { useState } from 'react';
import { importFromUrl } from '../../services/application.service.js';
import toast from 'react-hot-toast';

const AddApplicationModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    company: '',
    role: '',
    job_url: '',
    location: '',
    salary: '',
    notes: '',
    status: 'wishlist',
  });
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImport = async () => {
    if (!form.job_url.trim()) return toast.error('Enter a job URL first');
    setImporting(true);
    try {
      const data = await importFromUrl(form.job_url.trim());
      setForm((prev) => ({
        ...prev,
        company: data.company || prev.company,
        role: data.title || prev.role,
        location: data.location || prev.location,
      }));
      toast.success('Job details imported');
    } catch {
      toast.error('Could not import from URL');
    } finally {
      setImporting(false);
    }
  };

  const handleSave = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      return toast.error('Company and role are required');
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      toast.error('Failed to save application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-900 font-semibold">Add Application</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* URL importer */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Job URL{' '}
              <span className="text-gray-400 font-normal">(optional — auto-fills fields)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.job_url}
                onChange={(e) => handleChange('job_url', e.target.value)}
                placeholder="https://company.com/jobs/..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
              />
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
              >
                {importing ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>

          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Google"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Software Engineer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Helsinki, Finland"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Salary</label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                placeholder="€70,000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any notes about this application..."
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
            {saving ? 'Saving...' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApplicationModal;
