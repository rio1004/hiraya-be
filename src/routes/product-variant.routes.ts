import { Router } from "express";
import { ProductVariantController } from "../controller/product-variant.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { addProductVariantSchema } from "../schemas/product-variant.schema.js";

const router = Router();
router.post(
  "/",
  validate(addProductVariantSchema),
  ProductVariantController.addProductVariant,
);

export default router;
