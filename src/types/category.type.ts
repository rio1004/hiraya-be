import type { z } from "zod";
import type { createCategorySchema } from "../schemas/category.schema.js";

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
