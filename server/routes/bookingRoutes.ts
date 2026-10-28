import { Router } from "express";
import {
  bookingParamsSchema,
  cancelBooking,
  createBooking,
  listMyBookings,
} from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimiter";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createBookingInputSchema } from "../../shared/schema";

const router = Router();

router.get("/me", requireAuth, asyncHandler(listMyBookings));
router.post(
  "/",
  requireAuth,
  validateRequest({ body: createBookingInputSchema }),
  writeRateLimiter,
  asyncHandler(createBooking),
);
router.delete(
  "/:id",
  requireAuth,
  validateRequest({ params: bookingParamsSchema }),
  writeRateLimiter,
  asyncHandler(cancelBooking),
);

export default router;
