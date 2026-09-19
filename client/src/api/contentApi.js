import { axiosInstance } from './axiosInstance.js';

export const contentApi = {
  getAllContent: async (params = {}) => {
    const res = await axiosInstance.get('/content', { params });
    return res.data;
  },

  getContentById: async (id, lang = null) => {
    const res = await axiosInstance.get(`/content/${id}`, {
      params: lang ? { lang } : {},
    });
    return res.data;
  },

  createContent: async data => {
    const res = await axiosInstance.post('/content', data);
    return res.data;
  },

  updateContent: async (id, data) => {
    const res = await axiosInstance.put(`/content/${id}`, data);
    return res.data;
  },

  deleteContent: async id => {
    const res = await axiosInstance.delete(`/content/${id}`);
    return res.data;
  },
};
