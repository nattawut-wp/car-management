import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

/**
 * Builds the Express app without starting the HTTP server, so tests can
 * exercise the API without binding a port.
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_URL }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Order matters: these run only when no route above has responded.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
