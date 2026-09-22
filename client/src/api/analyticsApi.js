import { axiosInstance } from './axiosInstance.js';

export const analyticsApi = {
  getCohortSummary: async () => {
    const res = await axiosInstance.get('/analytics/cohort-summary');
    return res.data;
  },

  getLearnerRoster: async (params = {}) => {
    const res = await axiosInstance.get('/analytics/roster', { params });
    return res.data;
  },

  getInterventionAlerts: async () => {
    const res = await axiosInstance.get('/analytics/intervention-alerts');
    return res.data;
  },

  getLearnerTrajectory: async userId => {
    const res = await axiosInstance.get(`/analytics/learner-trajectory/${userId}`);
    return res.data;
  },
};
