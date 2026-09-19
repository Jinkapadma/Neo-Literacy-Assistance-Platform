import { axiosInstance } from './axiosInstance.js';

export const curriculumApi = {
  getAllCurricula: async (params = {}) => {
    const res = await axiosInstance.get('/curriculum', { params });
    return res.data;
  },

  getCurriculumById: async id => {
    const res = await axiosInstance.get(`/curriculum/${id}`);
    return res.data;
  },

  createCurriculum: async data => {
    const res = await axiosInstance.post('/curriculum', data);
    return res.data;
  },

  updateCurriculum: async (id, data) => {
    const res = await axiosInstance.put(`/curriculum/${id}`, data);
    return res.data;
  },

  deleteCurriculum: async id => {
    const res = await axiosInstance.delete(`/curriculum/${id}`);
    return res.data;
  },
};
