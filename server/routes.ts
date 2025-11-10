import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchPropertiesSchema, insertBookingSchema } from "@shared/schema";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export async function registerRoutes(app: Express): Promise<Server> {

  app.get('/api/properties', async (req, res) => {
    try {
      const filters = {
        type: req.query.type as 'hotel' | 'office' | 'all' | undefined,
        city: req.query.city as string | undefined,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        rating: req.query.rating ? parseInt(req.query.rating as string) : undefined,
        amenities: req.query.amenities ? (req.query.amenities as string).split(',') : undefined,
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });

  app.get('/api/bookings', ClerkExpressRequireAuth({}), async (req, res) => {
    try {
      const userId = (req.auth as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const bookings = await storage.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  app.post('/api/bookings', ClerkExpressRequireAuth({}), async (req, res) => {
    try {
      const userId = (req.auth as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const bookingData = { ...req.body, userId };
      const validatedData = insertBookingSchema.parse(bookingData);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(400).json({ error: 'Failed to create booking' });
    }
  });

  app.delete('/api/bookings/:id', ClerkExpressRequireAuth({}), async (req, res) => {
    try {
      const userId = (req.auth as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const booking = await storage.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden: Cannot cancel another user\'s booking' });
      }
      await storage.cancelBooking(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
