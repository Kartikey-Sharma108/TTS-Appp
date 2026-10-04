/**
 * Operational error with an HTTP status code and a stable machine-readable code.
 * Anything thrown in a controller/service is normalized by the error middleware.
 */
export class ApiError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(code, message, details) {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(code, message, details) {
    return new ApiError(401, code, message, details);
  }

  static forbidden(code, message, details) {
    return new ApiError(403, code, message, details);
  }

  static notFound(code, message, details) {
    return new ApiError(404, code, message, details);
  }

  static tooMany(code, message, details) {
    return new ApiError(429, code, message, details);
  }

  static internal(message = 'Internal server error', details) {
    return new ApiError(500, 'INTERNAL_ERROR', message, details);
  }

  static unavailable(code, message, details) {
    return new ApiError(503, code, message, details);
  }
}
