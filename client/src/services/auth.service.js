/**
 * AUTH SERVICE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: All auth endpoints are prefixed with /auth
 * Uses the shared api.js instance — token is attached automatically.
 *
 * Endpoints used:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/logout
 * ─────────────────────────────────────────────────────────────
 */

import api from './api.js';

/**
 * BACKEND: POST /api/auth/register
 * Request:  { name, email, password }
 * Response: { success: true, data: { token, user: { id, name, email } } }
 */
export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * BACKEND: POST /api/auth/login
 * Request:  { email, password }
 * Response: { success: true, data: { token, user: { id, name, email } } }
 */
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * BACKEND: POST /api/auth/logout
 * Invalidates the token server-side if blacklisting is implemented.
 * Token is always cleared from localStorage regardless.
 */
export const logoutUser = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
