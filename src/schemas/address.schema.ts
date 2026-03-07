import { z } from "zod";

export const addressSchema = z.object({
  barangayCode: z.string().min(1, "Barangay code is required"),
  cityCode: z.string().min(1, "City code is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  isDefault: z.boolean().default(false),
  postalCode: z.string().min(1, "Postal code is required"),
  provinceCode: z.string().optional(),
  regionCode: z.string().min(1, "Region code is required"),
  fullAddress: z.string().min(1, "Full address is required"),
});

export const createAddressSchema = z.object({
  body: addressSchema,
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: addressSchema.partial(),
});

export const addressParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});
