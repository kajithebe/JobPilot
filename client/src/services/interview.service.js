/**
 * INTERVIEW SERVICE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: All interview endpoints are prefixed with /interviews
 * Uses the shared api.js instance — token is attached automatically.
 *
 * Endpoints used:
 *   POST   /api/interviews
 *   GET    /api/interviews
 *   GET    /api/interviews/:id
 *   PUT    /api/interviews/:id
 *   DELETE /api/interviews/:id
 *   POST   /api/interviews/:id/checkin
 *   GET    /api/interviews/:id/prep-topics
 *   POST   /api/interviews/:id/prep-topics
 *   PATCH  /api/interviews/:id/prep-topics/:topicId
 *   DELETE /api/interviews/:id/prep-topics/:topicId
 *   GET    /api/interviews/pending-checkin
 * ─────────────────────────────────────────────────────────────
 */

import api from './api.js';

export const createInterview = async (data) => {
  const response = await api.post('/interviews', data);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interviews');
  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await api.put(`/interviews/${id}`, data);
  return response.data;
};

export const deleteInterview = async (id) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};

export const checkInInterview = async (id, outcome) => {
  const response = await api.post(`/interviews/${id}/checkin`, { outcome });
  return response.data;
};

export const getPrepTopics = async (interviewId) => {
  const response = await api.get(`/interviews/${interviewId}/prep-topics`);
  return response.data;
};

export const createPrepTopic = async (interviewId, topic) => {
  const response = await api.post(`/interviews/${interviewId}/prep-topics`, { topic });
  return response.data;
};

export const updatePrepTopic = async (interviewId, topicId, data) => {
  const response = await api.patch(`/interviews/${interviewId}/prep-topics/${topicId}`, data);
  return response.data;
};

export const deletePrepTopic = async (interviewId, topicId) => {
  const response = await api.delete(`/interviews/${interviewId}/prep-topics/${topicId}`);
  return response.data;
};

export const getPendingCheckIns = async () => {
  const response = await api.get('/interviews/pending-checkin');
  return response.data;
};
