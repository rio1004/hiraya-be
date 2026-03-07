import { z } from "zod";
import { AvailabilityStatusValues, WalletTypeValues } from "../types/enum.js";

export const addProductVariantSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid Product ID"),
    variant: z.object({
      color: z.string().min(1, "Color is required"),
      texture: z.string().min(1, "Texture is required"),
      walletType: z.nativeEnum(WalletTypeValues),
      price: z.number().min(0, "Price must be positive"),
      stock: z.number().int().min(0, "Stock must be non-negative"),
      availability: z.nativeEnum(AvailabilityStatusValues),
      sku: z.string().optional(),
      imgSrc: z.string().optional().nullable(),
    }),
  }),
});
