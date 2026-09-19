import { axiosInstance } from './axiosInstance.js';

export const authApi = {
  register: async data => {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },

  login: async credentials => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data;
  },

  refresh: async () => {
    const res = await axiosInstance.post('/auth/refresh');
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },

  getProfile: async () => {
    const res = await axiosInstance.get('/users/profile');
    return res.data;
  },

  updateProfile: async profileData => {
    const res = await axiosInstance.put('/users/profile', profileData);
    return res.data;
  },
};
