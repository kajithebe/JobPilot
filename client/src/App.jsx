/**
 * APP.JSX — Root Component & Route Definitions
 * ─────────────────────────────────────────────────────────────
 * BACKEND: No API calls here.
 * <Toaster /> handles all toast notifications globally.
 *
 * Public routes:  /, /login, /register
 * Protected routes: /dashboard (requires token in localStorage)
 * ─────────────────────────────────────────────────────────────
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
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
        <Route path="/" element={<Landing />} />
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
