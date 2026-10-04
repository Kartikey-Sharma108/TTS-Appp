import { ApiError } from '../utils/ApiError.js';
import { sanitizeText } from '../utils/text.js';
import {
  findVoice,
  isSupportedLanguage,
  getSupportedLanguages,
} from '../utils/voiceCatalog.js';

const MAX_LENGTH = () => {
  const configured = Number(process.env.MAX_TEXT_LENGTH);
  return Number.isFinite(configured) && configured > 0 ? configured : 500;
};

/**
 * Validates the POST /api/tts payload.
 * On success attaches `req.ttsInput = { text, language, voice }` where
 * `voice` is the full catalog entry (already sanitized/matched).
 */
export function validateTtsRequest(req, _res, next) {
  // 1. Request shape & content type ------------------------------------
  if (!req.is('application/json')) {
    return next(
      ApiError.badRequest('INVALID_CONTENT_TYPE', 'Content-Type must be application/json.'),
    );
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(ApiError.badRequest('INVALID_BODY', 'Request body must be a JSON object.'));
  }

  const { text, language, voice } = body;

  // 2. Text -------------------------------------------------------------
  if (text === undefined || text === null || (typeof text === 'string' && text.trim() === '')) {
    return next(ApiError.badRequest('EMPTY_TEXT', 'The "text" field is required and cannot be empty.'));
  }
  if (typeof text !== 'string') {
    return next(ApiError.badRequest('INVALID_TEXT', 'The "text" field must be a string.'));
  }

  const cleaned = sanitizeText(text);
  if (!cleaned) {
    return next(
      ApiError.badRequest('INVALID_TEXT', 'The "text" field contains no usable characters.'),
    );
  }

  const max = MAX_LENGTH();
  if (cleaned.length > max) {
    return next(
      ApiError.badRequest(
        'TEXT_TOO_LONG',
        `Text exceeds the maximum of ${max} characters (received ${cleaned.length}).`,
        { maxTextLength: max, received: cleaned.length },
      ),
    );
  }

  // 3. Language ----------------------------------------------------------
  if (!language || typeof language !== 'string') {
    return next(ApiError.badRequest('INVALID_LANGUAGE', 'The "language" field is required.'));
  }
  if (!isSupportedLanguage(language)) {
    return next(
      ApiError.badRequest('INVALID_LANGUAGE', `Unsupported language "${language}".`, {
        supportedLanguages: getSupportedLanguages().map((l) => l.code),
      }),
    );
  }

  // 4. Voice --------------------------------------------------------------
  if (!voice || typeof voice !== 'string') {
    return next(ApiError.badRequest('INVALID_VOICE', 'The "voice" field is required.'));
  }
  const voiceEntry = findVoice(voice);
  if (!voiceEntry) {
    return next(ApiError.badRequest('INVALID_VOICE', `Unknown voice "${voice}".`));
  }
  if (voiceEntry.language !== language) {
    return next(
      ApiError.badRequest('INVALID_VOICE', `Voice "${voice}" does not belong to language "${language}".`),
    );
  }

  req.ttsInput = { text: cleaned, language, voice: voiceEntry };
  return next();
}
