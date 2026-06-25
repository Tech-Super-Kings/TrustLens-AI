import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    details: error instanceof ApiError ? error.details : undefined,
  });
};
