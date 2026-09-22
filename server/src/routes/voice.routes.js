import { Router } from 'express';
import { evaluatePronunciation, getPracticePhrases } from '../controllers/voice.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Phase 3 Voice Recognition & Phonetic Pronunciation Routes
router.post('/pronunciation-eval', optionalAuth, evaluatePronunciation);
router.get('/practice-phrases', optionalAuth, getPracticePhrases);

export default router;
