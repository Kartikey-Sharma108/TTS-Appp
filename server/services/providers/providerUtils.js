import { ApiError } from '../../utils/ApiError.js';

/** fetch() wrapper that aborts after timeoutMs and maps network failures to ApiError. */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw ApiError.unavailable('TTS_PROVIDER_TIMEOUT', 'The Text-to-Speech provider did not respond in time. Please try again.');
    }
    throw ApiError.unavailable(
      'TTS_PROVIDER_NETWORK',
      'Could not reach the Text-to-Speech provider. Check the server network connection.',
      err?.cause?.message ?? err.message,
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Maps a non-2xx provider response to the right public status code. */
export async function throwProviderError(res, providerName) {
  const rawBody = await res.text().catch(() => '');
  const snippet = rawBody.slice(0, 300);

  if (res.status === 401 || res.status === 403) {
    throw ApiError.unauthorized(
      'PROVIDER_AUTH_FAILED',
      `The ${providerName} API key was rejected. Verify TTS_API_KEY on the server.`,
    );
  }
  if (res.status === 404) {
    throw ApiError.unavailable(
      'PROVIDER_NOT_FOUND',
      `Requested ${providerName} endpoint or voice was not found. Check TTS_ENDPOINT / voice configuration.`,
      snippet,
    );
  }
  if (res.status === 429) {
    throw ApiError.tooMany(
      'PROVIDER_RATE_LIMITED',
      `${providerName} rate-limited the request. Please try again shortly.`,
    );
  }
  if (res.status >= 500) {
    throw ApiError.unavailable('PROVIDER_UNAVAILABLE', `${providerName} is currently unavailable.`, snippet);
  }

  throw new ApiError(400, 'PROVIDER_REJECTED', `${providerName} rejected the request.`, snippet);
}

/**
 * Collects a readable stream into a Buffer and enforces a timeout.
 *
 * NOTE: we intentionally do NOT destroy the provided stream on timeout.
 * msedge-tts's Readable.destroy() deletes its internal request entry, and any
 * audio that arrives afterwards makes the library throw an uncaught TypeError
 * (this._streams[requestId] is undefined). On timeout we simply stop
 * collecting and keep consuming the stream safely.
 */
export async function streamToBuffer(stream, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    const timer = setTimeout(() => {
      finish(
        reject,
        ApiError.unavailable(
          'TTS_PROVIDER_TIMEOUT',
          'The Text-to-Speech provider did not respond in time.',
        ),
      );
    }, timeoutMs);

    stream.on('data', (chunk) => {
      if (!settled) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => finish(resolve, Buffer.concat(chunks)));
    stream.on('error', (err) => {
      finish(
        reject,
        ApiError.unavailable('TTS_PROVIDER_NETWORK', 'Audio streaming from the provider failed.', err.message),
      );
    });
    stream.on('close', () => {
      finish(
        reject,
        ApiError.unavailable('TTS_PROVIDER_NETWORK', 'The audio stream closed before the synthesis completed.'),
      );
    });
  });
}
