import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCategorySchema } from "../schemas/category.schema.js";

const router = Router();

router.post(
  "/",
  validate(createCategorySchema),
  CategoryController.createCategory,
);

export default router;
