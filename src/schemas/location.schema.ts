import { z } from "zod";

export const locationParamsSchema = z.object({
  params: z.object({
    code: z.string().min(1, "Location code is required"),
  }),
});

export const regionCodeParamsSchema = z.object({
  params: z.object({
    regionCode: z.string().min(1, "Region code is required"),
  }),
});

export const provinceCodeParamsSchema = z.object({
  params: z.object({
    provinceCode: z.string().min(1, "Province code is required"),
  }),
});

export const cityCodeParamsSchema = z.object({
  params: z.object({
    cityCode: z.string().min(1, "City code is required"),
  }),
});
