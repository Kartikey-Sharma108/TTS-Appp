import rateLimit from 'express-rate-limit';

const jsonMessage = (code, message) => ({
  success: false,
  error: { code, message },
});

/** Baseline limiter for the whole API. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: jsonMessage('RATE_LIMITED', 'Too many requests. Please slow down.'),
});

/** Stricter limiter on speech generation so the TTS provider cannot be abused. */
export const ttsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.TTS_RATE_LIMIT) > 0 ? Number(process.env.TTS_RATE_LIMIT) : 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: jsonMessage('TOO_MANY_REQUESTS', 'Speech generation rate limit reached. Please wait a minute.'),
});
