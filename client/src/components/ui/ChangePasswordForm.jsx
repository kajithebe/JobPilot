/**
 * CHANGE PASSWORD FORM
 * ─────────────────────────────────────────────────────────────
 * BACKEND: POST /api/users/change-password
 * Request:  { currentPassword, newPassword }
 * Response: { success: true }
 * Errors:
 *   400 → current password incorrect
 *   400 → new password too short
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { changePassword } from '../../services/user.service.js';
import toast from 'react-hot-toast';

const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthScore = getStrength(form.newPassword);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthTextColors = [
    '',
    'text-red-500',
    'text-yellow-500',
    'text-yellow-500',
    'text-green-500',
  ];
  const strengthBarColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-green-400'];

  const handleSave = async () => {
    if (!form.currentPassword) return toast.error('Enter your current password');
    if (!form.newPassword) return toast.error('Enter a new password');
    if (form.newPassword.length < 6)
      return toast.error('New password must be at least 6 characters');
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match');

    setSaving(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">Change Password</h2>

      <div className="space-y-4">
        {/* Current password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
          />
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
          />
          {/* Password strength */}
          {form.newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-0.5 rounded-full transition-colors ${
                      i <= strengthScore ? strengthBarColors[strengthScore] : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[11px] ${strengthTextColors[strengthScore]}`}>
                {strengthLabels[strengthScore]}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
          />
          {/* Mismatch warning */}
          {form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
          {form.confirmPassword && form.newPassword === form.confirmPassword && (
            <p className="text-xs text-green-500 mt-1">Passwords match</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 border-none cursor-pointer"
          >
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
