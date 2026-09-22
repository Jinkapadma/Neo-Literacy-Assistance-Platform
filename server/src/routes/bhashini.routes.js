import { Router } from 'express';
import {
  translateText,
  transliterateText,
  getTtsVoiceConfig,
} from '../controllers/bhashini.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/translate', optionalAuth, translateText);
router.post('/transliterate', optionalAuth, transliterateText);
router.get('/tts-config', optionalAuth, getTtsVoiceConfig);

export default router;
