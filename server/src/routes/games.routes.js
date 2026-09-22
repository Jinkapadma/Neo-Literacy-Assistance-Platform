import { Router } from 'express';
import {
  getWordScramblePuzzles,
  getMemoryMatchCards,
  getSpeedQuizQuestions,
  getSentenceBuilderPuzzles,
  recordGameCompletion,
} from '../controllers/games.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/word-scramble', optionalAuth, getWordScramblePuzzles);
router.get('/memory-match', optionalAuth, getMemoryMatchCards);
router.get('/speed-quiz', optionalAuth, getSpeedQuizQuestions);
router.get('/sentence-builder', optionalAuth, getSentenceBuilderPuzzles);
router.post('/record-completion', optionalAuth, recordGameCompletion);

export default router;
