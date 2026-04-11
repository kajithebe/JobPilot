import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import JobTracker from './pages/JobTracker.jsx';
import Interviews from './pages/Interviews.jsx';
import ATSChecker from './pages/ATSChecker.jsx';
import Settings from './pages/Settings.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — all wrapped in DashboardLayout */}
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
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ResumeBuilder />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-tracker"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <JobTracker />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Interviews />
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
