import type { Response } from "express";
import { createBookingInputSchema } from "../../shared/schema";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/auth";
import { Booking } from "../models/Booking";
import { OfficeSpace } from "../models/OfficeSpace";
import { AppError } from "../utils/appError";
import { getClerkUserProfile } from "../utils/clerk";
import { sendBookingEmail } from "../utils/email";
import { serializeBooking } from "../utils/serializers";

export const bookingParamsSchema = z.object({
  id: z.string().min(1),
});

function calculateTotalPrice(checkInIso: string, checkOutIso: string, pricePerUnit: number) {
  const checkIn = new Date(checkInIso);
  const checkOut = new Date(checkOutIso);
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (!Number.isFinite(days) || days <= 0) {
    throw new AppError(400, "checkOut must be after checkIn");
  }

  return days * pricePerUnit;
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const payload = createBookingInputSchema.parse(req.body);
  const property = await OfficeSpace.findById(payload.propertyId);
  if (!property) throw new AppError(404, "Property not found");

  const user = await getClerkUserProfile(req.auth!.userId);
  if (!user.email) throw new AppError(400, "Authenticated user is missing a primary email");

  const totalPrice = calculateTotalPrice(payload.checkIn, payload.checkOut, property.price);

  const booking = await Booking.create({
    propertyId: String(property._id),
    userId: user.userId,
    userEmail: user.email,
    checkIn: new Date(payload.checkIn),
    checkOut: new Date(payload.checkOut),
    guests: payload.guests,
    totalPrice,
    status: "confirmed",
    propertySnapshot: {
      title: property.title,
      address: property.address || property.city,
      city: property.city,
      type: property.type || "office",
      images: property.images || [],
    },
  });

  try {
    await sendBookingEmail({
      userEmail: user.email,
      name: user.name,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      totalPrice,
      propertyTitle: property.title,
      propertyAddress: property.address || property.city,
      propertyCity: property.city,
    });
  } catch (error) {
    console.error("Booking email failed", error);
  }

  res.status(201).json(serializeBooking(booking));
}

export async function listMyBookings(req: AuthenticatedRequest, res: Response) {
  const bookings = await Booking.find({ userId: req.auth!.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json(bookings.map(serializeBooking));
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.userId !== req.auth!.userId) {
    throw new AppError(403, "You can only cancel your own bookings");
  }

  booking.status = "cancelled";
  await booking.save();
  res.json({ success: true });
}
