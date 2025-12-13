import type { Express } from "express";
import { createServer } from "http";
import { OfficeSpace } from "./models/OfficeSpace";
import { Booking } from "./models/Booking";

export async function registerRoutes(app: Express) {

  // Get all office spaces
  app.get("/api/properties", async (req, res) => {
    try {
      const spaces = await OfficeSpace.find({});
      res.json(spaces);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch office spaces" });
    }
  });

  // Get one office space
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const space = await OfficeSpace.findById(req.params.id);
      if (!space) return res.status(404).json({ error: "Not found" });
      res.json(space);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch office space" });
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
