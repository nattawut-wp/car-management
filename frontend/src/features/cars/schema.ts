import { z } from "zod";
import type { Car, CarPayload } from "./types";

const requiredText = (label: string, maxLength: number) =>
  z.string().trim().min(1, `${label} is required`).max(maxLength);

export const carFormSchema = z.object({
  registrationNumber: requiredText("Registration number", 50),
  brand: requiredText("Brand", 50),
  model: requiredText("Model", 50),
  year: z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") return true;
      const year = Number(value);
      return Number.isInteger(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
    }, "Enter a year between 1900 and next year"),
  color: z.string().trim().max(30),
  notes: z.string().trim().max(500),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export const emptyCarFormValues: CarFormValues = {
  registrationNumber: "",
  brand: "",
  model: "",
  year: "",
  color: "",
  notes: "",
};

export function toCarFormValues(car: Car): CarFormValues {
  return {
    registrationNumber: car.registrationNumber,
    brand: car.brand,
    model: car.model,
    year: car.year?.toString() ?? "",
    color: car.color ?? "",
    notes: car.notes ?? "",
  };
}

export function toCarPayload(values: CarFormValues): CarPayload {
  return {
    registrationNumber: values.registrationNumber,
    brand: values.brand,
    model: values.model,
    year: values.year === "" ? null : Number(values.year),
    color: values.color || null,
    notes: values.notes || null,
  };
}
