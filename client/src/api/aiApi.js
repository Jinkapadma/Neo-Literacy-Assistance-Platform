import { axiosInstance } from './axiosInstance.js';

export const aiApi = {
  getPersonalizedPath: async () => {
    const res = await axiosInstance.get('/ai/personalized-path');
    return res.data;
  },

  getRecommendations: async () => {
    const res = await axiosInstance.get('/ai/recommendations');
    return res.data;
  },

  getSpacedRepetitionCards: async (params = {}) => {
    const res = await axiosInstance.get('/ai/spaced-repetition/cards', { params });
    return res.data;
  },

  submitCardReview: async payload => {
    const res = await axiosInstance.post('/ai/spaced-repetition/review', payload);
    return res.data;
  },

  getSmartHint: async payload => {
    const res = await axiosInstance.post('/ai/smart-hint', payload);
    return res.data;
  },
};
