import { Router } from 'express';
import { validateTtsRequest } from '../middleware/validateTtsRequest.js';
import { ttsLimiter } from '../middleware/rateLimiter.js';
import { downloadSpeech, synthesizeSpeech } from '../controllers/tts.controller.js';
import { listVoices } from '../controllers/voice.controller.js';
import { healthCheck } from '../controllers/health.controller.js';

const router = Router();

router.get('/health', healthCheck);
router.get('/voices', listVoices);
router.post('/tts', ttsLimiter, validateTtsRequest, synthesizeSpeech);
router.get('/tts/download/:fileId', downloadSpeech);

export default router;
