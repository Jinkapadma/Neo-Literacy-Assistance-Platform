import { Router } from 'express';
import {
  getAdaptiveLearningPath,
  getDueSpacedRepetitionCards,
  submitCardReview,
  getSmartHint,
  getNextRecommendations,
} from '../controllers/ai.controller.js';
import { verifyJWT, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Phase 2 AI Personalization & Adaptive Engine Routes
router.get('/personalized-path', verifyJWT, getAdaptiveLearningPath);
router.get('/recommendations', verifyJWT, getNextRecommendations);
router.get('/spaced-repetition/cards', verifyJWT, getDueSpacedRepetitionCards);
router.post('/spaced-repetition/review', verifyJWT, submitCardReview);
router.post('/smart-hint', optionalAuth, getSmartHint);

export default router;
