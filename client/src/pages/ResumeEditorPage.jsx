import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getResumeById,
  updateResume,
  createVersion,
  exportResumePDF,
} from '../services/resume.service.js';
import EditorPanel from '../components/resume/EditorPanel.jsx';
import CVPreview from '../components/resume/CVPreview.jsx';
import TemplateSwitcher from '../components/resume/TemplateSwitcher.jsx';
import VersionHistory from '../components/resume/VersionHistory.jsx';
import toast from 'react-hot-toast';

const ResumeEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const data = await getResumeById(id);
      setResume(data);
    } catch {
      toast.error('Resume not found');
      navigate('/resumes');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSave = useCallback(
    debounce(async (updatedResume) => {
      setSaving(true);
      try {
        await updateResume(updatedResume.id, {
          name: updatedResume.name,
          template: updatedResume.template,
          theme_config: updatedResume.theme_config,
          content: updatedResume.content,
          section_order: updatedResume.section_order,
        });
      } catch {
        toast.error('Auto-save failed');
      } finally {
        setSaving(false);
      }
    }, 1500),
    []
  );

  const handleChange = (updates) => {
    const updated = { ...resume, ...updates };
    setResume(updated);
    debouncedSave(updated);
  };

  const handleSaveVersion = async () => {
    if (!versionName.trim()) return toast.error('Please enter a version name');
    try {
      await createVersion(id, versionName.trim());
      toast.success(`Version "${versionName}" saved`);
      setVersionName('');
      setShowVersionModal(false);
    } catch {
      toast.error('Failed to save version');
    }
  };

  const handleRestore = async (version) => {
    try {
      await updateResume(id, {
        template: version.template,
        theme_config: version.theme_config,
        content: version.content,
        section_order: version.section_order,
      });

      setResume({
        ...resume,
        template: version.template,
        theme_config: version.theme_config,
        content: version.content,
        section_order: version.section_order,
      });

      setShowTemplateSwitcher(false);
    } catch {
      toast.error('Failed to restore version');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/resumes')}
            className="text-gray-400 hover:text-gray-700 transition text-sm"
          >
            ← Back
          </button>
          <input
            type="text"
            value={resume.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            className="bg-transparent text-gray-900 font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">
            {saving ? 'Saving...' : 'All changes saved'}
          </span>
          <button
            onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
          >
            Template & Theme
          </button>
          <button
            onClick={() => setShowVersionHistory(true)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
          >
            History
          </button>
          <button
            onClick={() => setShowVersionModal(true)}
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Save Version
          </button>
          <button
            onClick={() => {
              const date = new Date().toISOString().split('T')[0];
              const safeName = resume.name.replace(/[^a-z0-9]/gi, '_');
              exportResumePDF(id, `${safeName}_${date}.pdf`);
            }}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
          >
            ↓ Download PDF
          </button>
        </div>
      </div>

      {/* Template switcher panel */}
      {showTemplateSwitcher && (
        <TemplateSwitcher
          template={resume.template}
          themeConfig={resume.theme_config}
          onClose={() => setShowTemplateSwitcher(false)}
          onChange={(updates) => handleChange(updates)}
        />
      )}

      {/* Split screen */}
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel
          content={resume.content}
          sectionOrder={resume.section_order}
          onChange={(content, sectionOrder) =>
            handleChange({ content, section_order: sectionOrder })
          }
        />
        <CVPreview
          content={resume.content}
          template={resume.template}
          themeConfig={resume.theme_config}
          sectionOrder={resume.section_order}
        />
      </div>

      {/* Save Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-gray-900 font-semibold mb-1">Save Version</h3>
            <p className="text-gray-500 text-xs mb-4">
              Create an immutable snapshot of the current resume state.
            </p>
            <input
              type="text"
              placeholder="e.g. Software Engineer v1"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveVersion()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVersion}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Panel */}
      {showVersionHistory && (
        <VersionHistory
          resumeId={id}
          currentResume={resume}
          onRestore={handleRestore}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </div>
  );
};

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default ResumeEditorPage;
