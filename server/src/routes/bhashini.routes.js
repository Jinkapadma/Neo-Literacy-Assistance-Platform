import { Router } from 'express';
import {
  translateText,
  translateBatch,
  getUIBundle,
  getAgentProgressInsight,
  transliterateText,
  getTtsVoiceConfig,
} from '../controllers/bhashini.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/translate', optionalAuth, translateText);
router.post('/translate-batch', optionalAuth, translateBatch);
router.get('/ui-bundle', optionalAuth, getUIBundle);
router.post('/agent-progress', optionalAuth, getAgentProgressInsight);
router.post('/transliterate', optionalAuth, transliterateText);
router.get('/tts-config', optionalAuth, getTtsVoiceConfig);

export default router;
