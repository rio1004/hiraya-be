import { Router } from "express";
import { ProductVariantController } from "../controller/product-variant.controller.js";

const router = Router();
router.post("/", ProductVariantController.addProductVariant);

export default router;
