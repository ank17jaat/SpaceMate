import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'hotel' or 'office'
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewCount: integer("review_count").notNull(),
  images: text("images").array().notNull(),
  amenities: text("amenities").array().notNull(),
  maxGuests: integer("max_guests").default(2),
  maxOccupancy: integer("max_occupancy").default(2),
  featured: boolean("featured").default(false),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  userId: text("user_id").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests"),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default('confirmed'), // 'confirmed', 'cancelled'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Zod schemas for API validation
export const searchPropertiesSchema = z.object({
  type: z.enum(['hotel', 'office', 'all']).optional(),
  city: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
});

export type SearchPropertiesParams = z.infer<typeof searchPropertiesSchema>;
