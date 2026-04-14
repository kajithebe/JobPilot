import { useEffect, useState } from 'react';
import { getVersions } from '../../services/resume.service.js';
import toast from 'react-hot-toast';

const VersionHistory = ({ resumeId, currentResume, onRestore, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

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

  const handleRestore = async (version) => {
    if (!confirm(`Restore "${version.version_name}"? Current unsaved changes will be overwritten.`))
      return;
    setRestoringId(version.id);
    try {
      await onRestore(version);
      toast.success(`Restored "${version.version_name}"`);
      onClose();
    } catch {
      toast.error('Failed to restore version');
    } finally {
      setRestoringId(null);
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
      {/* Slide-over panel */}
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
            <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
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
                return (
                  <div
                    key={version.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition group"
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

                        {/* Diff indicators */}
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

                      {/* Restore button */}
                      <button
                        onClick={() => handleRestore(version)}
                        disabled={restoringId === version.id}
                        className="text-xs px-3 py-1.5 border border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 rounded-lg transition opacity-0 group-hover:opacity-100 disabled:opacity-50 whitespace-nowrap"
                      >
                        {restoringId === version.id ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
