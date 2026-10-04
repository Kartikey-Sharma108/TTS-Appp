import { listProviders } from '../services/providers/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSupportedLanguages, serializeVoice, VOICES } from '../utils/voiceCatalog.js';

export const listVoices = asyncHandler(async (_req, res) => {
  const active = process.env.TTS_PROVIDER || 'edge';
  res.json({
    success: true,
    provider: active,
    providers: listProviders(),
    count: VOICES.length,
    languages: getSupportedLanguages(),
    voices: VOICES.map(serializeVoice),
  });
});
