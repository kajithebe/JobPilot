import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumeById, updateResume, createVersion } from '../services/resume.service.js';
import EditorPanel from '../components/resume/EditorPanel.jsx';
import CVPreview from '../components/resume/CVPreview.jsx';
import TemplateSwitcher from '../components/resume/TemplateSwitcher.jsx';
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

  // Debounced save — fires 1.5s after last change
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080d1a]">
        <p className="text-gray-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#080d1a]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#0f1629]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/resumes')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <input
            type="text"
            value={resume.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            className="bg-transparent text-white font-medium text-sm border-b border-transparent hover:border-gray-600 focus:border-blue-500 focus:outline-none px-1 py-0.5"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-xs">
            {saving ? 'Saving...' : 'All changes saved'}
          </span>
          <button
            onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            Template & Theme
          </button>
          <button
            onClick={() => setShowVersionModal(true)}
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Version
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f1629] border border-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold mb-4">Save Version</h3>
            <input
              type="text"
              placeholder="e.g. Software Engineer v1"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveVersion()}
              className="w-full bg-[#080d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVersion}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default ResumeEditorPage;
