import type { NextFunction, Response } from "express";
import { log } from "../log";
import type { AuthenticatedRequest } from "./auth";

export function requestLogger(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    const actor = req.auth?.userId ? ` user=${req.auth.userId}` : "";
    log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms${actor}`, "http");
  });

  next();
}
