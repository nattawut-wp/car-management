export interface Car {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CarPayload = Pick<
  Car,
  "registrationNumber" | "brand" | "model" | "year" | "color" | "notes"
>;
