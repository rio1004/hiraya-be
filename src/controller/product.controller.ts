import type { Request, Response } from "express";
import { ProductService } from "../service/product.service.js";
import { AvailabilityStatus, WalletType } from "@prisma/client";
import { AvailabilityStatusValues, WalletTypeValues } from "../types/enum.js";

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, categoryId, variants } = req.body;
      if (!name || !categoryId || !variants || !Array.isArray(variants)) {
        return res.status(400).json({
          message: "Missing required product fields or variants array",
        });
      }

      // Basic validation for variants
      for (const variant of variants) {
        if (
          !variant.color ||
          !variant.texture ||
          !variant.walletType ||
          typeof variant.price !== "number" ||
          typeof variant.stock !== "number" ||
          !variant.availability
        ) {
          return res
            .status(400)
            .json({ message: "Invalid variant data provided" });
        }
        if (!Object.values(WalletTypeValues).includes(variant.walletType)) {
          return res
            .status(400)
            .json({ message: `Invalid WalletType: ${variant.walletType}` });
        }
        if (
          !Object.values(AvailabilityStatusValues).includes(
            variant.availability,
          )
        ) {
          return res.status(400).json({
            message: `Invalid AvailabilityStatus: ${variant.availability}`,
          });
        }
        // Ensure imgSrc is part of the variant if present
        if (
          variant.imgSrc !== undefined &&
          typeof variant.imgSrc !== "string" &&
          variant.imgSrc !== null
        ) {
          return res
            .status(400)
            .json({ message: "Invalid imgSrc type in variant" });
        }
      }

      const newProduct = await ProductService.createProduct(
        name,
        description,
        categoryId,
        variants,
      );
      res.status(201).json(newProduct);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getProducts(req: Request, res: Response) {
    try {
      const {
        page = "1",
        pageSize = "10",
        search,
        categoryId,
        minPrice,
        maxPrice,
        inStock,
        walletType,
        color,
        texture,
      } = req.query;

      const products = await ProductService.getProducts(
        parseInt(page as string),
        parseInt(pageSize as string),
        search as string,
        categoryId as string,
        minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice ? parseFloat(maxPrice as string) : undefined,
        inStock ? String(inStock).toLowerCase() === "true" : undefined,
        walletType as WalletType,
        color as string,
        texture as string,
      );
      res.status(200).json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid product ID provided" });
      }
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error: any) {
      console.error("Error fetching product by ID:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid product ID provided" });
      }
      const { name, description, isActive, categoryId, variants } = req.body;

      if (variants && !Array.isArray(variants)) {
        return res.status(400).json({ message: "Variants must be an array" });
      }

      if (variants) {
        for (const variant of variants) {
          if (
            variant.walletType &&
            !Object.values(WalletType).includes(variant.walletType)
          ) {
            return res
              .status(400)
              .json({ message: `Invalid WalletType: ${variant.walletType}` });
          }
          if (
            variant.availability &&
            !Object.values(AvailabilityStatusValues).includes(
              variant.availability,
            )
          ) {
            return res.status(400).json({
              message: `Invalid AvailabilityStatus: ${variant.availability}`,
            });
          }
          // Ensure imgSrc is part of the variant if present
          if (
            variant.imgSrc !== undefined &&
            typeof variant.imgSrc !== "string" &&
            variant.imgSrc !== null
          ) {
            return res
              .status(400)
              .json({ message: "Invalid imgSrc type in variant" });
          }
        }
      }

      const updatedProduct = await ProductService.updateProduct(
        id,
        name,
        description,
        isActive,
        categoryId,
        variants,
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .json({ message: "Product not found for update" });
      }
      res.status(200).json(updatedProduct);
    } catch (error: any) {
      console.error("Error updating product:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid product ID provided" });
      }
      const deletedProduct = await ProductService.deleteProduct(id);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ message: "Product not found for deletion" });
      }
      res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
