import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProductSchema,
  getProductsSchema,
  productParamsSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

const router = Router();

router.post(
  "/",
  validate(createProductSchema),
  ProductController.createProduct,
);
router.get("/", validate(getProductsSchema), ProductController.getProducts);
router.get(
  "/:id",
  validate(productParamsSchema),
  ProductController.getProductById,
);
router.put(
  "/:id",
  validate(updateProductSchema),
  ProductController.updateProduct,
);
router.delete(
  "/:id",
  validate(productParamsSchema),
  ProductController.deleteProduct,
);

export default router;
