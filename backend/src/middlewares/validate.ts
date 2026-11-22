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
 * Wraps a handler so it receives `params` and `body` already parsed and typed
 * by the given Zod schemas. Invalid input throws a ZodError (→ 400).
 *
 * @example
 * validate({ params: carIdParamSchema }, async ({ params }, res) => {
 *   res.json(await getCar(params.id));
 * });
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

    // An omitted schema defaults to ZodUndefined, so its value really is
    // undefined; TypeScript cannot link the two, hence the assertion.
    await handler({ params, body } as ValidatedInput<TParams, TBody>, res, req);
  };
}
