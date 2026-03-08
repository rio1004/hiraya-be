import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;

      if (parsed.body) {
        req.body = parsed.body;
      }
      if (parsed.query) {
        // In Express 5, req.query is a getter that might return a fresh object.
        // We modify the existing object instead of reassigning it to bypass getter restrictions.
        // First, clear existing keys
        for (const key in req.query) {
          delete (req.query as any)[key];
        }
        // Then assign validated/transformed keys
        Object.assign(req.query, parsed.query);
      }
      if (parsed.params) {
        // Same for req.params
        for (const key in req.params) {
          delete (req.params as any)[key];
        }
        Object.assign(req.params, parsed.params);
      }

      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      console.error("Validation Middleware Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
