import { z } from "zod";

const POSTGRES_INT_MAX = 2_147_483_647;

const requiredText = (maxLength: number) => z.string().trim().min(1).max(maxLength);

// Forms send "" for an empty optional field; store it as NULL instead.
const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).nullish().transform((value) => value || null);

export const carIdParamSchema = z.object({
  id: z.coerce.number().int().positive().max(POSTGRES_INT_MAX),
});

// PUT replaces the whole record, so create and update share one schema.
export const carInputSchema = z.object({
  registrationNumber: requiredText(50),
  brand: requiredText(50),
  model: requiredText(50),
  year: z
    .number()
    .int()
    .min(1900)
    .refine((year) => year <= new Date().getFullYear() + 1, "Year cannot be later than next year")
    .nullish()
    .transform((year) => year ?? null),
  color: optionalText(30),
  notes: optionalText(500),
});

export type CarInput = z.output<typeof carInputSchema>;
