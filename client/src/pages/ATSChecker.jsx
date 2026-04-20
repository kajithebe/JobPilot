import { useState, useEffect } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function ATSChecker() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [latestVersionId, setLatestVersionId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // BACKEND: GET /api/resumes — load user resumes for the dropdown
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes');
        setResumes(res.data || []);
      } catch {
        toast.error('Failed to load resumes');
      }
    };
    fetchResumes();
  }, []);

  // BACKEND: GET /api/resumes/:id/versions — fetch latest version when resume changes
  useEffect(() => {
    if (!selectedResumeId) {
      setLatestVersionId(null);
      return;
    }
    const fetchLatestVersion = async () => {
      try {
        const res = await api.get(`/resumes/${selectedResumeId}/versions`);
        const versions = res.data || [];
        setLatestVersionId(versions.length > 0 ? versions[0].id : null);
      } catch {
        setLatestVersionId(null);
      }
    };
    fetchLatestVersion();
  }, [selectedResumeId]);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }
    if (!latestVersionId) {
      toast.error('This resume has no saved versions yet');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      // BACKEND: POST /api/ats/score
      const res = await api.post('/ats/score', {
        resume_version_id: latestVersionId,
        job_description: jobDescription,
      });
      const data = res.data;
      setResult({
        score: data.score,
        matched_keywords: (data.matched || []).map((m) => ({
          keyword: m.keyword,
          frequency: m.weight,
        })),
        missing_keywords: (data.missing || []).map((kw) => ({
          keyword: kw,
          category: 'general',
        })),
      });
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
              {selectedResumeId && latestVersionId === null ? (
                <p className="text-xs text-amber-500 mt-2">
                  This resume has no saved versions yet. Save a version first.
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  The resume content will be matched against the job description.
                </p>
              )}
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

      {/* Results section */}
      {(loading || result) && (
        <div className="space-y-6">
          {/* Score gauge */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-6 text-center">
              Overall ATS Match Score
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400 text-sm">Analysing your resume...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Progress ring */}
                <div className="relative w-36 h-36 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                    {/* Background circle */}
                    <circle cx="72" cy="72" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    {/* Score circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      fill="none"
                      stroke={
                        result?.score >= 75
                          ? '#16a34a'
                          : result?.score >= 50
                            ? '#d97706'
                            : '#dc2626'
                      }
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - (result?.score || 0) / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  {/* Score number in center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{result?.score ?? 0}</span>
                    <span className="text-xs text-gray-400">/ 100</span>
                  </div>
                </div>

                {/* Score label */}
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    result?.score >= 75
                      ? 'bg-green-50 text-green-700'
                      : result?.score >= 50
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                  }`}
                >
                  {result?.score >= 75
                    ? 'Strong Match'
                    : result?.score >= 50
                      ? 'Partial Match'
                      : 'Weak Match'}
                </span>
              </div>
            )}
          </div>

          {/* Keywords section */}
          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Matched keywords — green */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Matched Keywords</h2>
                  <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    {result.matched_keywords?.length || 0} found
                  </span>
                </div>
                {result.matched_keywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.matched_keywords.map((kw, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-2.5 py-1 rounded-full"
                      >
                        <span className="font-medium">{kw.keyword}</span>
                        {/* Frequency count */}
                        <span className="bg-green-200 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          ×{Math.round(kw.frequency)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No matched keywords found.</p>
                )}
              </div>

              {/* Missing keywords — red/orange */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Missing Keywords</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      {result.missing_keywords?.length || 0} missing
                    </span>
                    {/* Copy missing keywords button */}
                    {result.missing_keywords?.length > 0 && (
                      <button
                        onClick={() => {
                          const keywords = result.missing_keywords
                            .map((kw) => kw.keyword)
                            .join(', ');
                          navigator.clipboard.writeText(keywords);
                          toast.success('Missing keywords copied!');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full transition cursor-pointer"
                      >
                        Copy all
                      </button>
                    )}
                  </div>
                </div>
                {result.missing_keywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          kw.category === 'skills'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : kw.category === 'experience'
                              ? 'bg-orange-50 border-orange-200 text-orange-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    🎉 No missing keywords — great match!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
