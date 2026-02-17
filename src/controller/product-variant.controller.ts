import type { Request, Response } from "express";
import { ProductVariantService } from "../service/product-variant.service.js";

export const ProductVariantController = {
  async addProductVariant(req: Request, res: Response) {
    try {
      const { variant, productId } = req.body;

      const newProductVariant = ProductVariantService.addProductVariant(
        productId,
        variant,
      );

      res.status(201).json(newProductVariant);
    } catch (error: any) {
      console.error("Error creating product variant:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
