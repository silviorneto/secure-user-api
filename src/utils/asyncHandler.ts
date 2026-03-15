import { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<void>

/**
 * Wraps an async route handler so that rejected promises are forwarded to
 * Express's next(err) — required in Express 4 which does not catch async
 * rejections automatically. Ensures Mitigation 11 (centralised error handler)
 * is reached on all failure paths, including database errors.
 */
export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next)
}
