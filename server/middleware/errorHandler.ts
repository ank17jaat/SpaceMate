import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { log } from "../log";
import { AppError } from "../utils/appError";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Route not found"));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      details: err.flatten(),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  log(
    `${req.method} ${req.path} failed :: ${
      err instanceof Error ? err.message : "Unknown error"
    }`,
    "error",
  );

  return res.status(500).json({ message: "Internal Server Error" });
}
