import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResumes, createResume, deleteResume } from '../services/resume.service.js';
import { ResumeListSkeleton } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

const defaultContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin: '',
    github: '',
    website: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

const defaultSectionOrder = [
  'personalInfo',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
];

const ResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const resume = await createResume({
        name: 'Untitled Resume',
        template: 'modern',
        theme_config: { primaryColor: '#2563eb', fontColor: '#111827', bgColor: '#ffffff' },
        content: defaultContent,
        section_order: defaultSectionOrder,
      });
      navigate(`/resumes/${resume.id}`);
    } catch {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
          <span className="text-xl font-bold text-blue-600">JobPilot</span>
        </nav>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <ResumeListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {creating ? 'Creating...' : '+ New Resume'}
        </button>
      </div>

      {/* Empty state */}
      {resumes.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg mb-4">No resumes yet</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
          >
            Create your first resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => navigate(`/resumes/${resume.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:shadow-sm transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-medium truncate">{resume.name}</h3>
                  <p className="text-gray-400 text-xs mt-1 capitalize">
                    {resume.template} template
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(resume.id, e)}
                  className="text-gray-300 hover:text-red-400 transition ml-2 opacity-0 group-hover:opacity-100 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesPage;
