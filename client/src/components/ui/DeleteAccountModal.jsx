/**
 * DELETE ACCOUNT MODAL
 * ─────────────────────────────────────────────────────────────
 * BACKEND: DELETE /api/users/me
 * Soft deletes the user account.
 * Response: { success: true }
 *
 * On success:
 *   - Clears token and user from localStorage
 *   - Redirects to /login
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../../services/user.service.js';
import { useAuth } from '../../store/authContext.jsx';
import toast from 'react-hot-toast';

const DeleteAccountModal = ({ onClose }) => {
  const [confirmation, setConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (confirmation !== 'DELETE') {
      return toast.error('Type DELETE to confirm');
    }

    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-semibold">Delete Account</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
          <p className="text-sm text-red-700 font-medium mb-1">This action cannot be undone</p>
          <p className="text-xs text-red-600">
            Deleting your account will permanently remove all your resumes, applications, interviews
            and activity history.
          </p>
        </div>

        {/* Confirmation input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="font-bold text-red-500">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="DELETE"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-300"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || confirmation !== 'DELETE'}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50 border-none cursor-pointer"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
