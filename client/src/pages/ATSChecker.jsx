import { useState, useEffect } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function ATSChecker() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // BACKEND: GET /api/resumes — load user resumes for the dropdown
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes');
        setResumes(res.data.data || []);
      } catch {
        toast.error('Failed to load resumes');
      }
    };
    fetchResumes();
  }, []);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      // BACKEND: POST /api/ats/score
      const res = await api.post('/ats/score', {
        resume_version_id: Number(selectedResumeId),
        job_description: jobDescription,
      });
      setResult(res.data.data);
    } catch {
      toast.error('Failed to check ATS score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ATS Score Checker</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste a job description and select a resume to see how well they match.
        </p>
      </div>

      {/* Input panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job description textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={10}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{jobDescription.length} characters</p>
          </div>

          {/* Resume selector + submit */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
              {/* BACKEND: populated from GET /api/resumes */}
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                The resume content will be matched against the job description.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-xl text-sm transition cursor-pointer border-none mt-6"
            >
              {loading ? 'Checking...' : 'Check ATS Score'}
            </button>
          </div>
        </div>
      </div>

      {/* Results placeholder — filled in next commits */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-400 text-sm">Analysing your resume...</p>
        </div>
      )}
    </div>
  );
}
