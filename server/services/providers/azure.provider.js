import { ApiError } from '../../utils/ApiError.js';
import { escapeXml } from '../../utils/text.js';
import { fetchWithTimeout, throwProviderError } from './providerUtils.js';

/** Microsoft Azure Speech Text-to-Speech (REST API, subscription key + region). */
export default {
  name: 'azure',
  displayName: 'Microsoft Azure Speech',
  formats: ['mp3'],

  isConfigured() {
    return Boolean(process.env.TTS_API_KEY && process.env.TTS_REGION);
  },

  async synthesize({ text, voice, language }) {
    const key = process.env.TTS_API_KEY;
    const region = process.env.TTS_REGION;
    if (!key || !region) {
      throw ApiError.unauthorized(
        'PROVIDER_NOT_CONFIGURED',
        'TTS_API_KEY and TTS_REGION must be set for the azure provider.',
      );
    }

    const voiceId = voice.providerVoices?.azure;
    if (!voiceId) {
      throw ApiError.badRequest('UNSUPPORTED_VOICE', `Voice "${voice.id}" is not available on the azure provider.`);
    }

    const endpoint =
      process.env.TTS_ENDPOINT || `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ssml =
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language}">` +
      `<voice name="${voiceId}">${escapeXml(text)}</voice></speak>`;

    const res = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'text-to-speech-app',
      },
      body: ssml,
    });

    if (!res.ok) await throwProviderError(res, 'Azure Speech');

    const buffer = Buffer.from(await res.arrayBuffer());
    return { buffer, contentType: 'audio/mpeg', extension: 'mp3' };
  },
};
