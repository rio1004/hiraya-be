import type { z } from "zod";
import type { addProductVariantSchema } from "../schemas/product-variant.schema.js";

export type AddProductVariantInput = z.infer<typeof addProductVariantSchema>["body"];
