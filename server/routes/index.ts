import type { Express } from "express";
import { initializeEmailService } from "../utils/email";
import bookingRoutes from "./bookingRoutes";
import metaRoutes from "./metaRoutes";
import propertyRoutes from "./propertyRoutes";

export function registerRoutes(app: Express) {
  initializeEmailService();
  app.use("/api", metaRoutes);
  app.use("/api/properties", propertyRoutes);
  app.use("/api/bookings", bookingRoutes);
}
