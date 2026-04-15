import api from './api.js';

/**
 * BACKEND: POST /api/resumes
 * Request:  { name, template, theme_config, content, section_order }
 * Response: resume object
 */
export const createResume = async (data) => {
  const response = await api.post('/resumes', data);
  return response.data;
};

/**
 * BACKEND: GET /api/resumes
 * Response: array of resume objects (excludes soft deleted)
 */
export const getResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

/**
 * BACKEND: GET /api/resumes/:id
 * Response: single resume object with full JSONB content
 */
export const getResumeById = async (id) => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

/**
 * BACKEND: PUT /api/resumes/:id
 * Request:  { name?, template?, theme_config?, content?, section_order? }
 * Response: updated resume object
 */
export const updateResume = async (id, data) => {
  const response = await api.put(`/resumes/${id}`, data);
  return response.data;
};

/**
 * BACKEND: DELETE /api/resumes/:id
 * Soft deletes the resume (is_deleted = true)
 */
export const deleteResume = async (id) => {
  const response = await api.delete(`/resumes/${id}`);
  return response.data;
};

/**
 * BACKEND: POST /api/resumes/:id/versions
 * Request:  { version_name }
 * Response: created version object (immutable snapshot)
 */
export const createVersion = async (id, versionName) => {
  const response = await api.post(`/resumes/${id}/versions`, {
    version_name: versionName,
  });
  return response.data;
};

/**
 * BACKEND: GET /api/resumes/:id/versions
 * Response: array of version objects ordered by created_at DESC
 */
export const getVersions = async (id) => {
  const response = await api.get(`/resumes/${id}/versions`);
  return response.data;
};

/**
 * BACKEND: DELETE /api/resumes/:id/versions/:versionId
 * Permanently deletes a version snapshot
 */
export const deleteVersion = async (resumeId, versionId) => {
  const response = await api.delete(`/resumes/${resumeId}/versions/${versionId}`);
  return response.data;
};
