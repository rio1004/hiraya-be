import type { z } from "zod";
import type { createOrderSchema, getOrderParamsSchema } from "../schemas/order.schema.js";

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type OrderParams = z.infer<typeof getOrderParamsSchema>["params"];
