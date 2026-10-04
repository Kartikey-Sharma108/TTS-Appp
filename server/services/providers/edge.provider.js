import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { ApiError } from '../../utils/ApiError.js';
import { escapeXml } from '../../utils/text.js';
import { streamToBuffer } from './providerUtils.js';

// 96 kbps mono MP3, ~24 kHz — good balance of quality and size.
const FORMAT = OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3;

/**
 * Microsoft Edge Read-Aloud API (free, no API key required).
 * Works server-side with any Node runtime.
 */
export default {
  name: 'edge',
  displayName: 'Microsoft Edge Read-Aloud (free, no key)',
  formats: ['mp3'],

  isConfigured() {
    return true;
  },

  async synthesize({ text, voice }) {
    const voiceId = voice.providerVoices?.edge;
    if (!voiceId) {
      throw ApiError.badRequest('UNSUPPORTED_VOICE', `Voice "${voice.id}" is not available on the edge provider.`);
    }

    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voiceId, FORMAT);
      const { audioStream } = await tts.toStream(escapeXml(text));
      const buffer = await streamToBuffer(audioStream);
      if (!buffer.length) {
        throw new Error('Provider returned an empty audio stream.');
      }
      return { buffer, contentType: 'audio/mpeg', extension: 'mp3' };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw ApiError.unavailable(
        'PROVIDER_UNAVAILABLE',
        'Microsoft Edge TTS is currently unavailable. Check your internet connection or try again later.',
        err?.message,
      );
    }
  },
};
