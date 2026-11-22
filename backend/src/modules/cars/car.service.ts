import { prisma } from "../../config/db.js";
import { HttpError } from "../../utils/HttpError.js";
import { isPrismaError, PrismaErrorCode } from "../../utils/prismaErrors.js";
import type { CarInput } from "./car.schema.js";

const notDeleted = { deletedAt: null };
const hideDeletedAt = { deletedAt: true } as const;

const carNotFound = () => new HttpError(404, "Car not found");

function toCarError(err: unknown): unknown {
  if (isPrismaError(err, PrismaErrorCode.RecordNotFound)) {
    return carNotFound();
  }
  if (isPrismaError(err, PrismaErrorCode.UniqueConstraintViolation)) {
    return new HttpError(409, "Registration number already exists", [
      { field: "registrationNumber", message: "This registration number is already registered" },
    ]);
  }
  return err;
}

export function listCars() {
  return prisma.car.findMany({
    where: notDeleted,
    orderBy: { createdAt: "desc" },
    omit: hideDeletedAt,
  });
}

export async function getCar(id: number) {
  const car = await prisma.car.findFirst({ where: { id, ...notDeleted }, omit: hideDeletedAt });
  if (!car) {
    throw carNotFound();
  }
  return car;
}

export async function createCar(input: CarInput) {
  try {
    return await prisma.car.create({ data: input, omit: hideDeletedAt });
  } catch (err) {
    throw toCarError(err);
  }
}

export async function updateCar(id: number, input: CarInput) {
  try {
    return await prisma.car.update({
      where: { id, ...notDeleted },
      data: input,
      omit: hideDeletedAt,
    });
  } catch (err) {
    throw toCarError(err);
  }
}

export async function softDeleteCar(id: number) {
  const { count } = await prisma.car.updateMany({
    where: { id, ...notDeleted },
    data: { deletedAt: new Date() },
  });
  if (count === 0) {
    throw carNotFound();
  }
}
