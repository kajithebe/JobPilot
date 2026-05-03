import { useState, useEffect } from 'react';
import { getProfile } from '../services/user.service.js';
import ProfileForm from '../components/ui/ProfileForm.jsx';
import ChangePasswordForm from '../components/ui/ChangePasswordForm.jsx';
import NotificationPreferences from '../components/ui/NotificationPreferences.jsx';
import DeleteAccountModal from '../components/ui/DeleteAccountModal.jsx';
import toast from 'react-hot-toast';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // BACKEND: GET /api/users/profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch {
        // Fall back to localStorage if API not ready
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(stored);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile, password and account preferences.
        </p>
      </div>

      {/* Profile form */}
      <ProfileForm user={user} onUpdate={handleProfileUpdate} />

      {/* Change password */}
      <ChangePasswordForm />

      {/* Notification preferences */}
      <NotificationPreferences preferences={user?.preferences} />

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Account Actions</h2>
        <p className="text-xs text-gray-400 mb-4">
          Once you delete your account, all your data will be permanently removed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg transition cursor-pointer bg-transparent"
        >
          Delete Account
        </button>
      </div>

      {/* Delete account modal */}
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
}
