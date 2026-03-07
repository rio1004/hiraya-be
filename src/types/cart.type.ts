import type { z } from "zod";
import type { addToCartSchema, getCartItemsSchema, updateCartQtySchema, deleteCartItemSchema } from "../schemas/cart.schema.js";

export type AddToCartInput = z.infer<typeof addToCartSchema>["body"];
export type GetCartItemsInput = z.infer<typeof getCartItemsSchema>;
export type UpdateCartQtyInput = z.infer<typeof updateCartQtySchema>["body"];
export type DeleteCartItemParams = z.infer<typeof deleteCartItemSchema>["params"];
