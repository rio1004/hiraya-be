import { z } from "zod";
import { AvailabilityStatusValues, WalletTypeValues } from "../types/enum.js";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional().nullable(),
    categoryId: z.string().uuid("Invalid Category ID"),
    variants: z.array(
      z.object({
        color: z.string().min(1, "Color is required"),
        texture: z.string().min(1, "Texture is required"),
        walletType: z.nativeEnum(WalletTypeValues),
        price: z.number().min(0, "Price must be positive"),
        stock: z.number().int().min(0, "Stock must be non-negative"),
        availability: z.nativeEnum(AvailabilityStatusValues),
        sku: z.string().optional(),
        imgSrc: z.string().optional().nullable(),
      })
    ).min(1, "At least one variant is required"),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number).optional(),
    inStock: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
    walletType: z.nativeEnum(WalletTypeValues).optional(),
    color: z.string().optional(),
    texture: z.string().optional(),
  }),
});

export const productParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Product ID"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Product ID"),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    categoryId: z.string().uuid().optional(),
    variants: z.array(
      z.object({
        id: z.string().uuid().optional(),
        color: z.string(),
        texture: z.string(),
        walletType: z.nativeEnum(WalletTypeValues),
        price: z.number().min(0),
        stock: z.number().int().min(0),
        availability: z.nativeEnum(AvailabilityStatusValues),
        sku: z.string().optional(),
        imgSrc: z.string().optional().nullable(),
      })
    ).optional(),
  }),
});
