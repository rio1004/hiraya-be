import type { z } from "zod";
import type { locationParamsSchema, regionCodeParamsSchema, provinceCodeParamsSchema, cityCodeParamsSchema } from "../schemas/location.schema.js";

export type LocationParams = z.infer<typeof locationParamsSchema>["params"];
export type RegionCodeParams = z.infer<typeof regionCodeParamsSchema>["params"];
export type ProvinceCodeParams = z.infer<typeof provinceCodeParamsSchema>["params"];
export type CityCodeParams = z.infer<typeof cityCodeParamsSchema>["params"];
