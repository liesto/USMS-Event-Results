/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express'
import type { APIResponse } from '../types.js'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Unhandled error:', err)

  const response: APIResponse<never> = {
    success: false,
    error: {
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  }

  res.status(500).json(response)
}

export function notFoundHandler(req: Request, res: Response) {
  const response: APIResponse<never> = {
    success: false,
    error: {
      error: 'NotFound',
      message: `Route ${req.method} ${req.path} not found`,
    },
  }

  res.status(404).json(response)
}
