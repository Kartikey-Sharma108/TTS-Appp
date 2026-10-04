import { ApiError } from '../../utils/ApiError.js';
import { fetchWithTimeout, throwProviderError } from './providerUtils.js';

const DEFAULT_ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech';

/** ElevenLabs Text-to-Speech (REST API, xi-api-key authentication). */
export default {
  name: 'elevenlabs',
  displayName: 'ElevenLabs',
  formats: ['mp3'],

  isConfigured() {
    return Boolean(process.env.TTS_API_KEY);
  },

  async synthesize({ text, voice }) {
    const apiKey = process.env.TTS_API_KEY;
    if (!apiKey) {
      throw ApiError.unauthorized('PROVIDER_NOT_CONFIGURED', 'TTS_API_KEY is not set for the elevenlabs provider.');
    }

    const voiceId = voice.providerVoices?.elevenlabs;
    if (!voiceId) {
      throw ApiError.badRequest('UNSUPPORTED_VOICE', `Voice "${voice.id}" is not available on the elevenlabs provider.`);
    }

    const base = process.env.TTS_ENDPOINT || DEFAULT_ENDPOINT;
    const url = `${base}/${voiceId}?output_format=mp3_44100_128`;

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
    });

    if (!res.ok) await throwProviderError(res, 'ElevenLabs');

    const buffer = Buffer.from(await res.arrayBuffer());
    return { buffer, contentType: 'audio/mpeg', extension: 'mp3' };
  },
};
