import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    variantId: z.string().uuid("Invalid Variant ID"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const getCartItemsSchema = z.object({
  query: z.object({
    ids: z.string().optional().transform((ids) => ids ? ids.split(",").filter(Boolean) : undefined),
  }),
  body: z.object({
    ids: z.array(z.string().uuid()).optional(),
  }),
});

export const updateCartQtySchema = z.object({
  body: z.object({
    variantId: z.string().uuid("Invalid Variant ID"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const deleteCartItemSchema = z.object({
  params: z.object({
    variantId: z.string().uuid("Invalid Variant ID"),
  }),
});
