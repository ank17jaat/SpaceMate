import type { Express } from "express";
import { createServer } from "http";
import { OfficeSpace } from "./models/OfficeSpace";
import { Booking } from "./models/Booking";

export async function registerRoutes(app: Express) {

  // Get office spaces with optional filters
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, minPrice, maxPrice, rating, amenities, ownerId, search } = req.query as any;

      // Build query for OfficeSpace collection
      const query: any = {};
      if (ownerId) query.ownerId = String(ownerId);
      if (search) query.title = { $regex: String(search), $options: "i" };
      if (city) query.city = { $regex: String(city), $options: "i" };
      if (minPrice) query.price = { ...(query.price || {}), $gte: Number(minPrice) };
      if (maxPrice) query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
      if (rating) query.rating = { $gte: Number(rating) };
      if (amenities) {
        // amenities can be comma separated
        const arr = String(amenities).split(',').map((a) => a.trim()).filter(Boolean);
        if (arr.length > 0) query.amenities = { $all: arr };
      }

      const docs = await OfficeSpace.find(query).lean();

      // Map documents to consistent public shape
      const mapped = docs.map((d: any) => ({
        id: String(d._id),
        title: d.title || '',
        description: d.description || '',
        city: d.city || '',
        address: d.address || '',
        price: d.price ?? 0,
        rating: d.rating ?? 0,
        amenities: d.amenities || [],
        images: d.images?.length ? d.images : [],
        ownerId: d.ownerId || undefined,
      }));

      res.json(mapped);
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
        id: String(space._id),
        title: space.title || '',
        description: space.description || '',
        city: space.city || '',
        address: space.address || '',
        price: space.price ?? 0,
        rating: space.rating ?? 0,
        amenities: space.amenities || [],
        images: space.images?.length ? space.images : [],
        ownerId: space.ownerId || undefined,
      };

      res.json(normalized);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch office space" });
    }
  });

  // Delete office space
  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const doc = await OfficeSpace.findByIdAndDelete(id);
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (error) {
      console.error('Delete office space error', error);
      res.status(500).json({ error: 'Failed to delete office space' });
    }
  });

  // Backward-compatible route: delete via /api/offices/:id
  app.delete("/api/offices/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const doc = await OfficeSpace.findByIdAndDelete(id);
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (error) {
      console.error('Delete office error', error);
      res.status(500).json({ error: 'Failed to delete office' });
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

      const out = {
        id: String(doc._id),
        title: doc.title,
        description: doc.description,
        city: doc.city,
        address: doc.address || '',
        price: doc.price ?? 0,
        rating: doc.rating ?? 0,
        amenities: doc.amenities || [],
        images: doc.images || [],
        ownerId: doc.ownerId || undefined,
      };
      res.status(201).json(out);
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
