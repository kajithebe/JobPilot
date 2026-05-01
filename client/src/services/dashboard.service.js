/**
 * DASHBOARD SERVICE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: All dashboard endpoints are prefixed with /dashboard
 * Uses the shared api.js instance — token attached automatically.
 *
 * Endpoints used:
 *   GET /api/dashboard/stats   — counts per pipeline stage
 *   GET /api/dashboard/alerts  — overdue interviews
 *   GET /api/activities        — paginated activity feed
 * ─────────────────────────────────────────────────────────────
 */

import api from './api.js';

/**
 * BACKEND: GET /api/dashboard/stats
 * Expected response:
 * {
 *   success: true,
 *   data: {
 *     total: number,
 *     wishlist: number,
 *     applied: number,
 *     interview: number,
 *     offer: number,
 *     rejected: number,
 *     withdrawn: number
 *   }
 * }
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

/**
 * BACKEND: GET /api/dashboard/alerts
 * Expected response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: number,
 *       company: string,
 *       role: string,
 *       scheduled_at: string,
 *       interview_type: string
 *     }
 *   ]
 * }
 */
export const getDashboardAlerts = async () => {
  const response = await api.get('/dashboard/alerts');
  return response.data;
};

/**
 * BACKEND: GET /api/activities
 * Query params: page (default 1), limit (default 10)
 * Expected response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: number,
 *       action: string,      ← e.g. "Applied to", "Interview scheduled at"
 *       entity: string,      ← e.g. company name
 *       entity_link: string, ← e.g. /job-tracker
 *       created_at: string
 *     }
 *   ],
 *   pagination: { total: number, page: number }
 * }
 */
export const getActivities = async (page = 1, limit = 10) => {
  const response = await api.get('/activities', { params: { page, limit } });
  return response.data;
};
