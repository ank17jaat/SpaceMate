import type { Express } from "express";
import { createServer } from "http";
import { OfficeSpace } from "./models/OfficeSpace";
import { Booking } from "./models/Booking";

export async function registerRoutes(app: Express) {

  // Get office spaces with optional filters
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, minPrice, maxPrice, rating, amenities, ownerId } = req.query as any;

      // Build query for OfficeSpace collection
      const query: any = {};
      if (ownerId) query.ownerId = String(ownerId);
      if (city) query.city = { $regex: String(city), $options: "i" };
      if (minPrice) query.price = { ...(query.price || {}), $gte: Number(minPrice) };
      if (maxPrice) query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
      if (rating) query.rating = { $gte: Number(rating) };
      if (amenities) {
        const arr = String(amenities).split(',').map((a) => a.trim()).filter(Boolean);
        if (arr.length > 0) query.amenities = { $all: arr };
      }

      const docs = await OfficeSpace.find(query).lean();

      // Normalize documents
      const normalized = docs.map((d: any) => ({
        _id: d._id || d.id,
        id: String(d._id || d.id),
        name: d.title || d.name || '',
        description: d.description || '',
        images: d.images && d.images.length ? d.images : d.image ? [d.image] : [],
        city: d.city || '',
        location: d.address || d.location || '',
        price: d.price != null ? d.price : d.pricePerNight || 0,
        rating: d.rating != null ? d.rating : 0,
        amenities: d.amenities || [],
        ownerId: d.ownerId || undefined,
      }));

      res.json(normalized);
    } catch (error) {
      console.error('Failed to fetch properties', error);
      res.status(500).json({ error: "Failed to fetch office spaces" });
    }
  });

  // Get one office space
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const space = await OfficeSpace.findById(req.params.id).lean();
      if (!space) return res.status(404).json({ error: "Not found" });

      const normalized = {
        _id: space._id,
        id: String(space._id),
        name: space.title || space.name || '',
        description: space.description || '',
        images: space.images && space.images.length ? space.images : space.image ? [space.image] : [],
        city: space.city || '',
        location: space.address || space.location || '',
        price: space.price != null ? space.price : space.pricePerNight || 0,
        rating: space.rating != null ? space.rating : 0,
        amenities: space.amenities || [],
      };
      res.json(normalized);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch office space" });
    }
  });

  // Create office space
  app.post("/api/properties", async (req, res) => {
    try {
      const { ownerId, title, description, price, city, amenities, images, rating, address } = req.body;

      if (!title || !description || price == null || !city) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const doc = await OfficeSpace.create({
        ownerId,
        title,
        description,
        price: Number(price),
        city,
        address,
        amenities: Array.isArray(amenities) ? amenities : [],
        images: Array.isArray(images) ? images : [],
        rating: rating != null ? Number(rating) : 0,
      });

      res.status(201).json(doc);
    } catch (error) {
      console.error("Create office space error:", error);
      res.status(400).json({ error: "Failed to create office space" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const booking = await Booking.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: "Failed to create booking" });
    }
  });



  // Get unique amenities
  app.get("/api/amenities", async (_req, res) => {
    try {
      const docs = await OfficeSpace.find({}, { amenities: 1 }).lean();
      const all = docs.flatMap((d: any) => d.amenities || []);
      const unique = Array.from(new Set(all)).filter(Boolean);
      res.json({ amenities: unique });
    } catch (error) {
      console.error("Failed to get amenities", error);
      res.status(500).json({ error: "Failed to fetch amenities" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (_req, res) => {
    try {
      const bookings = await Booking.find({});
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Delete booking
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      await Booking.findByIdAndDelete(req.params.id);
      res.json({ message: "Booking deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  return createServer(app);
}
