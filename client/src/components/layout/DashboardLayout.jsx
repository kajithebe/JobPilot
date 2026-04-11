import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

// Maps each route to the page title shown in the top bar
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/resume-builder': 'Resume Builder',
  '/job-tracker': 'Job Tracker',
  '/interviews': 'Interviews',
  '/ats-checker': 'ATS Checker',
  '/settings': 'Settings',
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'JobPilot';

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
