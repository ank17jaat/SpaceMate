import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  listMyProperties,
  listProperties,
  propertyListQuerySchema,
  propertyParamsSchema,
} from "../controllers/propertyController";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimiter";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createPropertyInputSchema } from "../../shared/schema";

const router = Router();

router.get("/", validateRequest({ query: propertyListQuerySchema }), asyncHandler(listProperties));
router.get("/mine", requireAuth, asyncHandler(listMyProperties));
router.get("/:id", validateRequest({ params: propertyParamsSchema }), asyncHandler(getPropertyById));
router.post(
  "/",
  requireAuth,
  validateRequest({ body: createPropertyInputSchema }),
  writeRateLimiter,
  asyncHandler(createProperty),
);
router.delete(
  "/:id",
  requireAuth,
  validateRequest({ params: propertyParamsSchema }),
  writeRateLimiter,
  asyncHandler(deleteProperty),
);

export default router;
