/**
 * API BASE INSTANCE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: Base URL points to http://localhost:5000/api in development.
 * Set VITE_API_URL in .env for production.
 *
 * This instance automatically:
 *   - Attaches JWT token to every request as Authorization: Bearer <token>
 *   - Handles 401 globally — clears token and redirects to /login
 * ─────────────────────────────────────────────────────────────
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and redirect to login
// BACKEND: Return 401 for expired or invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
