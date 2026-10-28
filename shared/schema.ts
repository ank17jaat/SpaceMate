import { z } from "zod";

export const propertyTypeSchema = z.enum(["office", "hotel"]);
export type PropertyType = z.infer<typeof propertyTypeSchema>;

export const propertySchema = z.object({
  id: z.string(),
  ownerId: z.string().optional(),
  title: z.string(),
  description: z.string(),
  city: z.string(),
  address: z.string(),
  price: z.number().nonnegative(),
  rating: z.number().nonnegative(),
  reviewCount: z.number().int().nonnegative(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url()).default([]),
  type: propertyTypeSchema,
  maxGuests: z.number().int().positive().default(1),
  createdAt: z.string().optional(),
});
export type Property = z.infer<typeof propertySchema>;

export const searchPropertiesParamsSchema = z.object({
  city: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),
  amenities: z.union([z.array(z.string()), z.string()]).optional(),
  type: propertyTypeSchema.optional(),
});
export type SearchPropertiesParams = z.infer<typeof searchPropertiesParamsSchema>;

export const createPropertyInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
  city: z.string().trim().min(2).max(120),
  address: z.string().trim().min(2).max(240),
  price: z.number().nonnegative().max(1_000_000),
  amenities: z.array(z.string().trim().min(1).max(50)).max(50).default([]),
  images: z.array(z.string().url()).max(20).default([]),
  type: propertyTypeSchema.default("office"),
  maxGuests: z.number().int().positive().max(100).default(1),
});
export type CreatePropertyInput = z.infer<typeof createPropertyInputSchema>;

export const createBookingInputSchema = z.object({
  propertyId: z.string().trim().min(1),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().positive().max(100),
});
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

export const bookingStatusSchema = z.enum(["confirmed", "cancelled"]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const bookingPropertySummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  city: z.string(),
  type: propertyTypeSchema,
  images: z.array(z.string().url()).default([]),
});
export type BookingPropertySummary = z.infer<typeof bookingPropertySummarySchema>;

export const bookingSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  userId: z.string(),
  userEmail: z.string().email(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().positive(),
  totalPrice: z.number().nonnegative(),
  status: bookingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  property: bookingPropertySummarySchema,
});
export type Booking = z.infer<typeof bookingSchema>;
