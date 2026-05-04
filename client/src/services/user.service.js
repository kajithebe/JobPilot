/**
 * USER SERVICE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: All user endpoints
 * Uses the shared api.js instance — token attached automatically.
 *
 * Endpoints used:
 *   GET    /api/users/profile          — get current user profile
 *   PUT    /api/users/profile          — update name and email
 *   POST   /api/users/change-password  — verify old, set new password
 *   PUT    /api/users/preferences      — save notification preferences
 *   DELETE /api/users/me               — soft delete account
 * ─────────────────────────────────────────────────────────────
 */

import api from './api.js';

/**
 * BACKEND: GET /api/users/profile
 * Expected response:
 * {
 *   success: true,
 *   data: { id, name, email, preferences: { emailNotifications: bool } }
 * }
 */
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

/**
 * BACKEND: PUT /api/users/profile
 * Request:  { name, email }
 * Response: { success: true, data: { id, name, email } }
 */
export const updateProfile = async (data) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

/**
 * BACKEND: POST /api/users/change-password
 * Request:  { currentPassword, newPassword }
 * Response: { success: true }
 * Errors:
 *   400 → current password incorrect
 *   400 → new password too short
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('/users/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * BACKEND: PUT /api/users/preferences
 * Request:  { emailNotifications: bool }
 * Response: { success: true, data: { emailNotifications: bool } }
 */
export const updatePreferences = async (preferences) => {
  const response = await api.put('/users/preferences', preferences);
  return response.data;
};

/**
 * BACKEND: DELETE /api/users/me
 * Soft deletes the user account.
 * Response: { success: true }
 * Frontend should clear token and redirect to /login after this.
 */
export const deleteAccount = async () => {
  const response = await api.delete('/users/me');
  return response.data;
};
