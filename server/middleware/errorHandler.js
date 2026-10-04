import { ApiError } from '../utils/ApiError.js';

/**
 * Central error handler. Normalizes known error types (ApiError, body-parser
 * errors, provider errors) into a stable JSON envelope and hides internals
 * for unexpected 500s.
 */
export function errorHandler(err, req, res, _next) {
  let error = err;

  // body-parser / express.json failures
  if (err?.type === 'entity.parse.failed') {
    error = ApiError.badRequest('INVALID_JSON', 'Request body is not valid JSON.');
  } else if (err?.type === 'entity.too.large') {
    error = ApiError.badRequest('PAYLOAD_TOO_LARGE', 'Request body is too large.');
  } else if (err instanceof SyntaxError && err.status === 400) {
    error = ApiError.badRequest('INVALID_JSON', 'Request body is not valid JSON.');
  } else if (err?.status === 413) {
    error = ApiError.badRequest('PAYLOAD_TOO_LARGE', 'Request body is too large.');
  }

  if (!(error instanceof ApiError)) {
    // Unknown / unexpected error: log it, respond generically.
    // eslint-disable-next-line no-console
    console.error('[ERROR] Unhandled error:', err);
    error = ApiError.internal('An unexpected error occurred while processing the request.');
  }

  res.status(error.status).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    },
  });
}
