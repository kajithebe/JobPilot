import api from './api.js';

export const getChartData = async (range = 30) => {
  const response = await api.get('/dashboard/charts', { params: { days: range } });
  const raw = response.data;

  return {
    data: {
      applicationsOverTime: (raw.timeline || []).map((r) => ({
        date: r.date,
        count: parseInt(r.count),
      })),
      pipelineFunnel: (raw.funnel || []).map((r) => ({
        stage: r.status,
        count: parseInt(r.count),
      })),
      interviewOutcomes: (raw.outcomes || []).map((r) => ({
        outcome: r.outcome,
        count: parseInt(r.count),
      })),
    },
  };
};
