import type { RequestHandler } from "express";
import { validate } from "../../middlewares/validate.js";
import { carIdParamSchema, carInputSchema } from "./car.schema.js";
import { createCar, getCar, listCars, softDeleteCar, updateCar } from "./car.service.js";

export const list: RequestHandler = async (_req, res) => {
  res.json(await listCars());
};

export const getById = validate({ params: carIdParamSchema }, async ({ params }, res) => {
  res.json(await getCar(params.id));
});

export const create = validate({ body: carInputSchema }, async ({ body }, res, req) => {
  const car = await createCar(body);
  res.status(201).location(`${req.baseUrl}/${car.id}`).json(car);
});

export const update = validate(
  { params: carIdParamSchema, body: carInputSchema },
  async ({ params, body }, res) => {
    res.json(await updateCar(params.id, body));
  },
);

export const remove = validate({ params: carIdParamSchema }, async ({ params }, res) => {
  await softDeleteCar(params.id);
  res.status(204).end();
});
