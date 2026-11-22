import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { carRouter } from "./modules/cars/car.routes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_URL }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/v1/cars", carRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
