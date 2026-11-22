import type { Request, RequestHandler, Response } from "express";
import type { z } from "zod";

interface ValidationSchemas<TParams extends z.ZodType, TBody extends z.ZodType> {
  params?: TParams;
  body?: TBody;
}

export interface ValidatedInput<TParams extends z.ZodType, TBody extends z.ZodType> {
  params: z.output<TParams>;
  body: z.output<TBody>;
}

/**
 * Parses `req.params` and `req.body` with the given Zod schemas, then calls
 * the handler with the parsed values as typed arguments.
 *
 * A middleware that overwrites `req.body` would leave it typed as `any` in the
 * handler, forcing a cast. Passing the parsed values in keeps the types that
 * Zod inferred. Invalid input throws a ZodError, which the error handler turns
 * into a 400 response.
 *
 * @example
 * router.put("/:id", validate({ params: carIdParamSchema, body: updateCarSchema }, updateCar));
 */
export function validate<
  TParams extends z.ZodType = z.ZodUndefined,
  TBody extends z.ZodType = z.ZodUndefined,
>(
  schemas: ValidationSchemas<TParams, TBody>,
  handler: (input: ValidatedInput<TParams, TBody>, res: Response, req: Request) => unknown,
): RequestHandler {
  return async (req, res) => {
    const params = schemas.params?.parse(req.params);
    const body = schemas.body?.parse(req.body);

    // When a schema is omitted its generic defaults to ZodUndefined, so the
    // matching value really is `undefined`. TypeScript cannot follow that
    // link between the optional schema and its default, hence the assertion.
    await handler({ params, body } as ValidatedInput<TParams, TBody>, res, req);
  };
}
