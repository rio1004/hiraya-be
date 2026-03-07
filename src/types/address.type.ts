import type { z } from "zod";
import type { createAddressSchema, updateAddressSchema, addressParamsSchema } from "../schemas/address.schema.js";

export type CreateAddressInput = z.infer<typeof createAddressSchema>["body"];
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>["body"];
export type AddressParams = z.infer<typeof addressParamsSchema>["params"];
