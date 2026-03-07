import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        variantId: z.string().uuid("Invalid Variant ID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    ).min(1, "Order must contain at least one item"),
    deliveryFee: z.number().min(0, "Delivery fee must be non-negative").default(0),
    addressId: z.number().int().optional(),
    newAddress: z.object({
      barangayCode: z.string(),
      cityCode: z.string(),
      contactName: z.string(),
      contactPhone: z.string(),
      isDefault: z.boolean().default(false),
      postalCode: z.string(),
      provinceCode: z.string().optional(),
      regionCode: z.string(),
      fullAddress: z.string(),
    }).optional(),
  }).refine((data) => data.addressId || data.newAddress, {
    message: "Either addressId or newAddress must be provided",
    path: ["addressId", "newAddress"],
  }),
});

export const getOrderParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Order ID"),
  }),
});
