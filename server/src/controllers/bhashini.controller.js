import { BhashiniService } from '../services/bhashini.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const translateText = asyncHandler(async (req, res) => {
  const { text, sourceLanguage = 'en', targetLanguage = 'te' } = req.body;
  const translation = await BhashiniService.translateText(text, sourceLanguage, targetLanguage);
  return ApiResponse.success(res, translation, 'Text translated successfully via Bhashini');
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
