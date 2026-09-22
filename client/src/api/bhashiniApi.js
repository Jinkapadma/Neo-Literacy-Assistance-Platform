import { axiosInstance } from './axiosInstance.js';

export const bhashiniApi = {
  translateText: async (text, sourceLanguage = 'en', targetLanguage = 'te') => {
    const res = await axiosInstance.post('/bhashini/translate', {
      text,
      sourceLanguage,
      targetLanguage,
    });
    return res.data;
  },

  transliterateText: async (text, targetLanguage = 'te') => {
    const res = await axiosInstance.post('/bhashini/transliterate', {
      text,
      targetLanguage,
    });
    return res.data;
  },

  getTtsVoiceConfig: async (language = 'te') => {
    const res = await axiosInstance.get('/bhashini/tts-config', {
      params: { language },
    });
    return res.data;
  },
};
