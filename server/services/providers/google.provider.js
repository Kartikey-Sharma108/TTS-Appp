import { ApiError } from '../../utils/ApiError.js';
import { fetchWithTimeout, throwProviderError } from './providerUtils.js';

const DEFAULT_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/** Google Cloud Text-to-Speech (REST API, key-based authentication). */
export default {
  name: 'google',
  displayName: 'Google Cloud Text-to-Speech',
  formats: ['mp3'],

  isConfigured() {
    return Boolean(process.env.TTS_API_KEY);
  },

  async synthesize({ text, voice, language }) {
    const apiKey = process.env.TTS_API_KEY;
    if (!apiKey) {
      throw ApiError.unauthorized('PROVIDER_NOT_CONFIGURED', 'TTS_API_KEY is not set for the google provider.');
    }

    const voiceId = voice.providerVoices?.google;
    if (!voiceId) {
      throw ApiError.badRequest('UNSUPPORTED_VOICE', `Voice "${voice.id}" is not available on the google provider.`);
    }

    const endpoint = process.env.TTS_ENDPOINT || DEFAULT_ENDPOINT;
    const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${encodeURIComponent(apiKey)}`;

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: language, name: voiceId },
        audioConfig: { audioEncoding: 'MP3' },
      }),
    });

    if (!res.ok) await throwProviderError(res, 'Google Cloud TTS');

    const data = await res.json();
    if (!data?.audioContent) {
      throw ApiError.unavailable('PROVIDER_BAD_RESPONSE', 'Google Cloud TTS returned no audio.');
    }
    const buffer = Buffer.from(data.audioContent, 'base64');
    return { buffer, contentType: 'audio/mpeg', extension: 'mp3' };
  },
};
