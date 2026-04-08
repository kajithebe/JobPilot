/**
 * APP.JSX — Root Component & Route Definitions
 * ─────────────────────────────────────────────────────────────
 * BACKEND: No API calls here.
 * <Toaster /> handles all toast notifications globally.
 *
 * Public routes:  /login, /register
 * Protected routes: /dashboard (requires token in localStorage)
 *
 * NOTE: Landing page (/) is handled by Sani — not included here yet.
 * Will be added once Sani's Landing page PR is merged into dev.
 * ─────────────────────────────────────────────────────────────
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Placeholder — will be replaced in Task 10
const Dashboard = () => (
  <div className="p-8 text-white bg-[#080d1a] min-h-screen">Dashboard — coming in Task 10!</div>
);

const App = () => {
  return (
    <BrowserRouter>
      {/* Global toast notifications — position top-right */}
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — redirect to /login if no token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default — redirect to /login until Landing page is added by Sani */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
