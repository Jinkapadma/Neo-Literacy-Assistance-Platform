import { AiPersonalizationService } from '../services/aiPersonalization.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getAdaptiveLearningPath = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const pathData = await AiPersonalizationService.getAdaptiveLearningPath(userId);
  return ApiResponse.success(res, pathData, 'Adaptive learning path retrieved successfully');
});

export const getDueSpacedRepetitionCards = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const language = req.query.language || req.user.preferredLanguage;
  const cards = await AiPersonalizationService.getDueReviewCards(userId, language);
  return ApiResponse.success(res, cards, 'Spaced repetition cards retrieved successfully');
});

export const submitCardReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cardId, qualityRating } = req.body;
  const updatedItem = await AiPersonalizationService.processCardReview(userId, cardId, qualityRating);
  return ApiResponse.success(res, updatedItem, 'Flashcard review processed successfully');
});

export const getSmartHint = asyncHandler(async (req, res) => {
  const { wordOrPrompt, questionId, userLanguage, language = 'te' } = req.body;
  const lang = userLanguage || language || 'te';
  const prompt = wordOrPrompt || questionId || 'phoneme_practice';
  const hint = await AiPersonalizationService.generateSmartHint(prompt, lang);
  const responseData = {
    ...hint,
    hintText: hint.generalHint || 'Break down each syllable and observe the vowel diacritic carefully.',
    mnemonic: hint.phoneticMnemonic || 'Connect the visual shape of the glyph with its acoustic sound.',
  };
  return ApiResponse.success(res, responseData, 'Contextual hint generated successfully');
});

export const getNextRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const pathData = await AiPersonalizationService.getAdaptiveLearningPath(userId);

  const recommendations = [
    {
      type: 'spaced_repetition',
      title: 'Daily Memory Booster (SM-2)',
      description: 'Review due flashcards scheduled by spaced repetition algorithm.',
      icon: 'Brain',
      link: '/spaced-repetition',
      priority: 'high',
    },
    {
      type: 'voice_practice',
      title: 'Speech & Phoneme Lab',
      description: 'Practice pronunciation with real-time acoustic feedback.',
      icon: 'Mic',
      link: '/voice-practice',
      priority: 'medium',
    },
    {
      type: 'adaptive_module',
      title: pathData.nodes.find(n => n.nodeId === pathData.activeNodeId)?.title || 'Next Lesson',
      description: pathData.ddaRecommendation,
      icon: 'BookOpen',
      link: '/curriculum',
      priority: 'high',
    },
  ];

  return ApiResponse.success(res, { recommendations, ddaRecommendation: pathData.ddaRecommendation }, 'Recommendations retrieved');
});
