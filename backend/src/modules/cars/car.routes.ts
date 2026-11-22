import { Router } from "express";
import * as carController from "./car.controller.js";

export const carRouter = Router();

carRouter.get("/", carController.list);
carRouter.get("/:id", carController.getById);
carRouter.post("/", carController.create);
carRouter.put("/:id", carController.update);
carRouter.delete("/:id", carController.remove);
