import { axiosInstance } from './axiosInstance.js';

export const assessmentApi = {
  getAllAssessments: async (params = {}) => {
    const res = await axiosInstance.get('/assessments', { params });
    return res.data;
  },

  getAssessmentById: async id => {
    const res = await axiosInstance.get(`/assessments/${id}`);
    return res.data;
  },

  submitAssessment: async payload => {
    const res = await axiosInstance.post('/assessments/submit', payload);
    return res.data;
  },

  getUserBenchmark: async userId => {
    const res = await axiosInstance.get(`/assessments/benchmark/${userId}`);
    return res.data;
  },

  getSubmissionById: async submissionId => {
    const res = await axiosInstance.get(`/assessments/submissions/${submissionId}`);
    return res.data;
  },
};
