import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { HttpError } from "../utils/HttpError.js";

interface ErrorResponse {
  status: number;
  message: string;
  details?: unknown;
}

function toErrorResponse(err: unknown): ErrorResponse {
  if (err instanceof HttpError) {
    return { status: err.statusCode, message: err.message, details: err.details };
  }

  if (err instanceof ZodError) {
    return {
      status: 400,
      message: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference
    if (err.code === "P2002") {
      return { status: 409, message: "A record with the same unique value already exists" };
    }
    if (err.code === "P2025") {
      return { status: 404, message: "Record not found" };
    }
  }

  // Errors raised by express.json() (e.g. malformed JSON) carry a 4xx status
  // and `expose: true`, meaning their message is safe to show the client.
  if (isExposableHttpError(err)) {
    return { status: err.status, message: err.message };
  }

  return { status: 500, message: "Internal server error" };
}

function isExposableHttpError(err: unknown): err is { status: number; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "expose" in err &&
    err.expose === true &&
    "status" in err &&
    typeof err.status === "number"
  );
}

// Express recognises an error handler only by its four parameters, so `_next`
// must stay in the signature even though it is unused.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const { status, message, details } = toErrorResponse(err);

  // Never leak internals to the client; log them for the developer instead.
  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: details === undefined ? { message } : { message, details } });
};
