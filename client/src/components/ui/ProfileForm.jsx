/**
 * PROFILE FORM
 * ─────────────────────────────────────────────────────────────
 * BACKEND: PUT /api/users/profile
 * Request:  { name, email }
 * Response: { success: true, data: { id, name, email } }
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { updateProfile } from '../../services/user.service.js';
import toast from 'react-hot-toast';

const ProfileForm = ({ user, onUpdate }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(form.email)) return toast.error('Enter a valid email');

    setSaving(true);
    try {
      const res = await updateProfile(form);
      // Update localStorage user object
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...res.data }));
      onUpdate(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">Profile</h2>

      {/* Avatar initials */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-white">{getInitials(form.name)}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{form.name || 'Your Name'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{form.email || 'your@email.com'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Alex Johnson"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 border-none cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
