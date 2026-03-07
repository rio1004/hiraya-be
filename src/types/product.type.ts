import type { z } from "zod";
import type { createProductSchema, getProductsSchema, productParamsSchema, updateProductSchema } from "../schemas/product.schema.js";

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
export type ProductParams = z.infer<typeof productParamsSchema>["params"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
