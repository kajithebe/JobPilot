/**
 * CHARTS SERVICE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: GET /api/dashboard/charts
 * Query params: range (30 | 60 | 90) — days to look back
 *
 * Expected response:
 * {
 *   success: true,
 *   data: {
 *     applicationsOverTime: [
 *       { date: string, count: number }
 *     ],
 *     pipelineFunnel: [
 *       { stage: string, count: number }
 *     ],
 *     interviewOutcomes: [
 *       { outcome: string, count: number }
 *     ]
 *   }
 * }
 * ─────────────────────────────────────────────────────────────
 */

import api from './api.js';

export const getChartData = async (range = 30) => {
  const response = await api.get('/dashboard/charts', { params: { range } });
  return response.data;
};
