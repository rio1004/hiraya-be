import type { Request, Response } from "express";
import { CategoryService } from "../service/category.service.js";

export const CategoryController = {
  async createCategory(req: Request, res: Response) {
    console.log("Received request to create category");
    try {
      const { name } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ messsage: "Missing required category fields" });
      }
      const newCategory = await CategoryService.createCategory(name);
      res.status(201).json(newCategory);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
