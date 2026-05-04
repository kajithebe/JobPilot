/**
 * NOTIFICATION PREFERENCES
 * ─────────────────────────────────────────────────────────────
 * BACKEND: PUT /api/users/preferences
 * Request:  { emailNotifications: bool }
 * Response: { success: true, data: { emailNotifications: bool } }
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { updatePreferences } from '../../services/user.service.js';
import toast from 'react-hot-toast';

const NotificationPreferences = ({ preferences }) => {
  const [emailNotifications, setEmailNotifications] = useState(
    preferences?.emailNotifications ?? true
  );
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    setSaving(true);
    try {
      await updatePreferences({ emailNotifications: newValue });
      toast.success(newValue ? 'Email notifications enabled' : 'Email notifications disabled');
    } catch (err) {
      setEmailNotifications(!newValue);
      toast.error(err.response?.data?.error || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">Notification Preferences</h2>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-900">Interview Reminders</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Receive email reminders 24 hours before scheduled interviews
          </p>
        </div>
        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer disabled:opacity-50 ${
            emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Email reminders are sent via our automated system.
        {/* BACKEND: node-cron triggers Nodemailer 24h before interview */}
      </p>
    </div>
  );
};

export default NotificationPreferences;
