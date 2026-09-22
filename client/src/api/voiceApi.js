import { axiosInstance } from './axiosInstance.js';

export const voiceApi = {
  evaluatePronunciation: async payload => {
    const res = await axiosInstance.post('/voice/pronunciation-eval', payload);
    return res.data;
  },

  getPracticePhrases: async (params = {}) => {
    const res = await axiosInstance.get('/voice/practice-phrases', { params });
    return res.data;
  },
};
