/**
 * PROTECTED ROUTE
 * ─────────────────────────────────────────────────────────────
 * Checks for token in localStorage before rendering the page.
 * BACKEND: Token validity is checked by verifyToken middleware
 * on every API call. If expired, api.js interceptor clears it
 * and redirects to /login automatically.
 * ─────────────────────────────────────────────────────────────
 */

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
