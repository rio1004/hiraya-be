import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";

const router = Router();

router.post('/', CategoryController.createCategory);

export default router;
