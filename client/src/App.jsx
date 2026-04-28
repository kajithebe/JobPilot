import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import InterviewsPage from './pages/InterviewsPage.jsx';
import ATSChecker from './pages/ATSChecker.jsx';
import Settings from './pages/Settings.jsx';
import ResumesPage from './pages/ResumesPage.jsx';
import ResumeEditorPage from './pages/ResumeEditorPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
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
