import { Prisma } from "../generated/prisma/client.js";

export const PrismaErrorCode = {
  UniqueConstraintViolation: "P2002",
  RecordNotFound: "P2025",
} as const;

type PrismaErrorCode = (typeof PrismaErrorCode)[keyof typeof PrismaErrorCode];

export function isPrismaError(err: unknown, code: PrismaErrorCode): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;
}
