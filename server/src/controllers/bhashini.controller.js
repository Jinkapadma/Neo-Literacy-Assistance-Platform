import { BhashiniService } from '../services/bhashini.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const translateText = asyncHandler(async (req, res) => {
  const { text, sourceLanguage = 'en', targetLanguage = 'te' } = req.body;
  const translation = await BhashiniService.translateText(text, sourceLanguage, targetLanguage);
  return ApiResponse.success(res, translation, 'Text translated successfully via Bhashini');
});

export const translateBatch = asyncHandler(async (req, res) => {
  const { texts = [], sourceLanguage = 'en', targetLanguage = 'te' } = req.body;
  const translations = await BhashiniService.translateBatch(texts, sourceLanguage, targetLanguage);
  return ApiResponse.success(res, { translations }, 'Batch texts translated successfully via Bhashini');
});

export const getUIBundle = asyncHandler(async (req, res) => {
  const language = req.query.language || 'en';
  const bundle = BhashiniService.getUIBundle(language);
  return ApiResponse.success(res, { language, bundle }, 'UI translation bundle retrieved');
});

export const getAgentProgressInsight = asyncHandler(async (req, res) => {
  const {
    learningLanguage = req.user?.learningLanguage || req.user?.preferredLanguage || 'te',
    interfaceLanguage = req.user?.interfaceLanguage || 'en',
    progressData = {},
  } = req.body;

  const userProfile = {
    name: req.user?.name || 'Learner',
    proficiencyLevel: req.user?.proficiencyLevel || 'beginner',
  };

  const insight = BhashiniService.getAgentProgressInsight({
    learningLanguage,
    interfaceLanguage,
    progressData,
    userProfile,
  });

  return ApiResponse.success(res, insight, 'AI Agent progress insight synthesized successfully');
});

export const transliterateText = asyncHandler(async (req, res) => {
  const { text, targetLanguage = 'te' } = req.body;
  const result = BhashiniService.transliterateText(text, targetLanguage);
  return ApiResponse.success(res, result, 'Text transliterated successfully via Bhashini');
});

export const getTtsVoiceConfig = asyncHandler(async (req, res) => {
  const language = req.query.language || 'te';
  const config = BhashiniService.getTtsVoiceConfig(language);
  return ApiResponse.success(res, config, 'Bhashini TTS configuration retrieved');
});
