import type { Request, Response } from "express";
import { ProductVariantService } from "../service/product-variant.service.js";
import type { AddProductVariantInput } from "../types/product-variant.type.js";

export const ProductVariantController = {
  async addProductVariant(req: Request, res: Response) {
    try {
      const { variant, productId } = req.body as AddProductVariantInput;

      const cleanedVariant: any = {
        color: variant.color,
        texture: variant.texture,
        walletType: variant.walletType,
        price: variant.price,
        stock: variant.stock,
        availability: variant.availability,
      };
      if (variant.sku !== undefined) cleanedVariant.sku = variant.sku;
      if (variant.imgSrc !== undefined)
        cleanedVariant.imgSrc = variant.imgSrc ?? undefined;

      const newProductVariant = await ProductVariantService.addProductVariant(
        productId,
        cleanedVariant,
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
