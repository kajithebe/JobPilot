import api from './api.js';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getDashboardAlerts = async () => {
  const response = await api.get('/dashboard/alerts');
  return response.data;
};

export const getActivities = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const response = await api.get('/dashboard/activities', {
    params: { limit, offset },
  });
  const transformed = (response.data || []).map((activity) => ({
    id: activity.id,
    action: formatAction(activity.action, activity.entity_type),
    entity: activity.metadata?.company || activity.metadata?.role || activity.entity_type,
    entity_link: getEntityLink(activity.entity_type),
    created_at: activity.created_at,
  }));
  return {
    data: transformed,
    pagination: null,
  };
};

const formatAction = (action, entityType) => {
  const map = {
    created: `New ${entityType}`,
    status_changed: 'Status updated —',
    deleted: `${entityType} deleted`,
    scheduled: 'Interview scheduled',
    checked_in: 'Interview checked in',
    cancelled: 'Interview cancelled',
  };
  return map[action] || action;
};

const getEntityLink = (entityType) => {
  const map = {
    application: '/job-tracker',
    interview: '/interviews',
    resume: '/resumes',
  };
  return map[entityType] || null;
};
