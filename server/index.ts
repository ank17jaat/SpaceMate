import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { createServer } from "http";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./database/connect";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";
import { registerRoutes } from "./routes";
import { log } from "./log";
import { strictCors } from "./utils/cors";

const app = express();
app.set("trust proxy", 1);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

connectDB();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(strictCors);
app.use(apiRateLimiter);
app.use(requestLogger);

registerRoutes(app);

const server = createServer(app);

(async () => {
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else if (
    fs.existsSync(path.resolve(import.meta.dirname, "public", "index.html"))
  ) {
    const { serveStatic } = await import("./vite");
    serveStatic(app);
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})();
