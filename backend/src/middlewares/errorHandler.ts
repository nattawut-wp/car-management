import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/HttpError.js";
import { isPrismaError, PrismaErrorCode } from "../utils/prismaErrors.js";

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

  if (isPrismaError(err, PrismaErrorCode.UniqueConstraintViolation)) {
    return { status: 409, message: "A record with the same unique value already exists" };
  }

  if (isPrismaError(err, PrismaErrorCode.RecordNotFound)) {
    return { status: 404, message: "Record not found" };
  }

  if (isClientSafeHttpError(err)) {
    return { status: err.status, message: err.message };
  }

  return { status: 500, message: "Internal server error" };
}

// Errors from express.json(), such as malformed JSON, set `expose: true` to
// mark their message as safe to send to the client.
function isClientSafeHttpError(err: unknown): err is { status: number; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "expose" in err &&
    err.expose === true &&
    "status" in err &&
    typeof err.status === "number"
  );
}

// Express treats a middleware as an error handler only when it declares four
// parameters, so `_next` must stay even though it is unused.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const { status, message, details } = toErrorResponse(err);

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: details === undefined ? { message } : { message, details } });
};
