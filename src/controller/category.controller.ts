import type { Request, Response } from "express";
import { CategoryService } from "../service/category.service.js";
import type { CreateCategoryInput } from "../types/category.type.js";

export const CategoryController = {
  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body as CreateCategoryInput;
      const newCategory = await CategoryService.createCategory(name);
      res.status(201).json(newCategory);
    } catch (error: any) {
      console.error("Error creating category:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
