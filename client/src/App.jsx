import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import InterviewsPage from './pages/InterviewsPage.jsx';
import ATSChecker from './pages/ATSChecker.jsx';
import Settings from './pages/Settings.jsx';
import ResumesPage from './pages/ResumesPage.jsx';
import ResumeEditorPage from './pages/ResumeEditorPage.jsx';
import CheckInModal from './components/tracker/CheckInModal.jsx';
import { getPendingCheckIns, checkInInterview } from './services/interview.service.js';
import { useAuth } from './hooks/useAuth.js';
import toast from 'react-hot-toast';

// ── Check-in flow wrapper ─────────────────────────────────────────────
const CheckInFlow = () => {
  const { token } = useAuth();
  const [pendingCheckIns, setPendingCheckIns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!token) return;
    getPendingCheckIns()
      .then((data) => setPendingCheckIns(data || []))
      .catch(() => {});
  }, [token]);

  const handleSubmit = async (interviewId, outcome) => {
    try {
      await checkInInterview(interviewId, outcome);
      toast.success('Check-in saved');
      advance();
    } catch {
      toast.error('Failed to save check-in');
    }
  };

  const advance = () => {
    if (currentIndex < pendingCheckIns.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPendingCheckIns([]);
    }
  };

  if (!token || pendingCheckIns.length === 0) return null;

  const current = pendingCheckIns[currentIndex];

  return (
    <CheckInModal
      interview={current}
      onSubmit={handleSubmit}
      onSkip={advance}
      totalPending={pendingCheckIns.length}
      currentIndex={currentIndex}
    />
  );
};

// ── App ───────────────────────────────────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <CheckInFlow />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — inside DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ResumesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-tracker"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ApplicationsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats-checker"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ATSChecker />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Resume editor — full screen, NO DashboardLayout */}
        <Route
          path="/resumes/:id"
          element={
            <ProtectedRoute>
              <ResumeEditorPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
