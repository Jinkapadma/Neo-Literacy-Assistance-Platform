import { axiosInstance } from './axiosInstance.js';

export const gamesApi = {
  getWordScramblePuzzles: async (params = {}) => {
    const res = await axiosInstance.get('/games/word-scramble', { params });
    return res.data;
  },

  getMemoryMatchCards: async (params = {}) => {
    const res = await axiosInstance.get('/games/memory-match', { params });
    return res.data;
  },

  getSpeedQuizQuestions: async (params = {}) => {
    const res = await axiosInstance.get('/games/speed-quiz', { params });
    return res.data;
  },

  getSentenceBuilderPuzzles: async (params = {}) => {
    const res = await axiosInstance.get('/games/sentence-builder', { params });
    return res.data;
  },

  recordGameCompletion: async payload => {
    const res = await axiosInstance.post('/games/record-completion', payload);
    return res.data;
  },
};
