import { ApiError } from '../utils/ApiError.js';

/** 404 for routes that do not exist. */
export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound('ROUTE_NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found.`));
}
