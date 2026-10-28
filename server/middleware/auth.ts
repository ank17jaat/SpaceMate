import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { verifyClerkSessionToken } from "../utils/clerk";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionClaims: Record<string, unknown>;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing bearer token"));
  }

  try {
    const sessionClaims = await verifyClerkSessionToken(
      authHeader.slice("Bearer ".length).trim(),
    );
    const userId = sessionClaims.sub;

    if (!userId) {
      return next(new AppError(401, "Invalid session token"));
    }

    req.auth = {
      userId,
      sessionClaims: sessionClaims as Record<string, unknown>,
    };

    return next();
  } catch (_error) {
    return next(new AppError(401, "Unauthorized"));
  }
}
