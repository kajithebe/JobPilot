import { useEffect, useState } from 'react';
import { getVersions, deleteVersion } from '../../services/resume.service.js';
import { VersionListSkeleton } from '../ui/Skeleton.jsx';
import toast from 'react-hot-toast';

const VersionHistory = ({ resumeId, currentResume, onRestore, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  // confirmAction: { type: 'restore' | 'delete', version }

  useEffect(() => {
    fetchVersions();
  }, [resumeId]);

  const fetchVersions = async () => {
    try {
      const data = await getVersions(resumeId);
      setVersions(data);
    } catch {
      toast.error('Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreConfirmed = async (version) => {
    setConfirmAction(null);
    setRestoringId(version.id);
    try {
      await onRestore(version);
      toast.success(`Restored "${version.version_name}"`);
    } catch {
      toast.error('Failed to restore version');
    } finally {
      setRestoringId(null);
    }
  };

  const handleDeleteConfirmed = async (version) => {
    setConfirmAction(null);
    setDeletingId(version.id);
    try {
      await deleteVersion(resumeId, version.id);
      setVersions((prev) => prev.filter((v) => v.id !== version.id));
      toast.success(`Deleted "${version.version_name}"`);
    } catch {
      toast.error('Failed to delete version');
    } finally {
      setDeletingId(null);
    }
  };

  const getDiff = (version) => {
    const diffs = [];
    if (version.template !== currentResume.template) {
      diffs.push(`Template: ${version.template}`);
    }
    const versionSections = version.section_order?.length || 0;
    const currentSections = currentResume.section_order?.length || 0;
    if (versionSections !== currentSections) {
      diffs.push(`${versionSections} sections`);
    }
    return diffs;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-end z-50">
      <div className="bg-white h-full w-full max-w-sm shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-gray-900 font-semibold">Version History</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {versions.length} snapshot{versions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Version list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <VersionListSkeleton />
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No versions saved yet</p>
              <p className="text-gray-300 text-xs mt-1">
                Click "Save Version" to create a snapshot
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => {
                const diffs = getDiff(version);
                const isRestoring = restoringId === version.id;
                const isDeleting = deletingId === version.id;

                return (
                  <div
                    key={version.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-medium truncate">
                          {version.version_name}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 capitalize">
                          {version.template} template
                        </p>
                        <p className="text-gray-300 text-xs mt-0.5">
                          {new Date(version.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {diffs.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {diffs.map((diff, i) => (
                              <span
                                key={i}
                                className="text-xs bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-full"
                              >
                                {diff}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setConfirmAction({ type: 'restore', version })}
                          disabled={isRestoring || isDeleting}
                          className="text-xs px-3 py-1.5 border border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 rounded-lg transition disabled:opacity-40 whitespace-nowrap"
                        >
                          {isRestoring ? 'Restoring...' : 'Restore'}
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'delete', version })}
                          disabled={isRestoring || isDeleting}
                          className="text-xs px-3 py-1.5 border border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-500 rounded-lg transition disabled:opacity-40 whitespace-nowrap"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Inline confirmation modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-lg mx-4">
            {confirmAction.type === 'restore' ? (
              <>
                <h4 className="text-gray-900 font-semibold mb-1">Restore Version</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Restore{' '}
                  <span className="font-medium text-gray-700">
                    "{confirmAction.version.version_name}"
                  </span>
                  ? Current unsaved changes will be overwritten.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRestoreConfirmed(confirmAction.version)}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Restore
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-gray-900 font-semibold mb-1">Delete Version</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Permanently delete{' '}
                  <span className="font-medium text-gray-700">
                    "{confirmAction.version.version_name}"
                  </span>
                  ? This cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteConfirmed(confirmAction.version)}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
