import type { Request, Response } from "express";
import { z } from "zod";
import { createPropertyInputSchema } from "../../shared/schema";
import type { AuthenticatedRequest } from "../middleware/auth";
import { OfficeSpace } from "../models/OfficeSpace";
import { AppError } from "../utils/appError";
import { serializeProperty } from "../utils/serializers";

export const propertyListQuerySchema = z.object({
  city: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  amenities: z.string().optional(),
  type: z.enum(["office", "hotel"]).optional(),
});

export const propertyParamsSchema = z.object({
  id: z.string().min(1),
});

export async function listProperties(req: Request, res: Response) {
  const { city, minPrice, maxPrice, rating, amenities, search, type } =
    propertyListQuerySchema.parse(req.query);

  const query: Record<string, unknown> = {};

  if (search) query.$text = { $search: search };
  if (city) query.city = { $regex: city, $options: "i" };
  if (type) query.type = type;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) (query.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (query.price as Record<string, number>).$lte = maxPrice;
  }
  if (rating !== undefined) query.rating = { $gte: rating };
  if (amenities) {
    const parsedAmenities = amenities.split(",").map((item) => item.trim()).filter(Boolean);
    if (parsedAmenities.length > 0) query.amenities = { $all: parsedAmenities };
  }

  const properties = await OfficeSpace.find(query).sort({ createdAt: -1 }).lean();
  res.json(properties.map(serializeProperty));
}

export async function listMyProperties(req: AuthenticatedRequest, res: Response) {
  const properties = await OfficeSpace.find({ ownerId: req.auth!.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json(properties.map(serializeProperty));
}

export async function getPropertyById(req: Request, res: Response) {
  const property = await OfficeSpace.findById(req.params.id).lean();
  if (!property) throw new AppError(404, "Property not found");
  res.json(serializeProperty(property));
}

export async function createProperty(req: AuthenticatedRequest, res: Response) {
  const payload = createPropertyInputSchema.parse(req.body);

  const property = await OfficeSpace.create({
    ownerId: req.auth!.userId,
    title: payload.title,
    description: payload.description,
    city: payload.city,
    address: payload.address,
    price: payload.price,
    amenities: payload.amenities,
    images: payload.images,
    type: payload.type,
    capacity: payload.maxGuests,
  });

  res.status(201).json(serializeProperty(property));
}

export async function deleteProperty(req: AuthenticatedRequest, res: Response) {
  const property = await OfficeSpace.findById(req.params.id);

  if (!property) throw new AppError(404, "Property not found");
  if (property.ownerId !== req.auth!.userId) {
    throw new AppError(403, "You can only delete your own properties");
  }

  await property.deleteOne();
  res.json({ success: true });
}
