import type { Request, Response } from "express";
import { ProductService } from "../service/product.service.js";
import type {
  CreateProductInput,
  GetProductsQuery,
  ProductParams,
  UpdateProductInput,
} from "../types/product.type.js";

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, categoryId, variants } =
        req.body as CreateProductInput;

      const mappedVariants = variants.map((v) => {
        const variant: any = {
          color: v.color,
          texture: v.texture,
          walletType: v.walletType,
          price: v.price,
          stock: v.stock,
          availability: v.availability,
        };
        if (v.sku !== undefined) variant.sku = v.sku;
        if (v.imgSrc !== undefined) variant.imgSrc = v.imgSrc ?? undefined;
        return variant;
      });

      const newProduct = await ProductService.createProduct(
        name,
        description ?? null,
        categoryId,
        mappedVariants,
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
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      const search = req.query.search as string | undefined;
      const categoryId = req.query.categoryId as string | undefined;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const inStock = req.query.inStock === "true" ? true : req.query.inStock === "false" ? false : undefined;
      const walletType = req.query.walletType as any;
      const color = req.query.color as string | undefined;
      const texture = req.query.texture as string | undefined;

      const products = await ProductService.getProducts(
        page,
        pageSize,
        search,
        categoryId,
        minPrice,
        maxPrice,
        inStock,
        walletType,
        color,
        texture,
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
      const { id } = req.params as unknown as ProductParams;
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
      const { id } = req.params as unknown as ProductParams;
      const { name, description, isActive, categoryId, variants } =
        req.body as UpdateProductInput["body"];

      const mappedVariants = variants?.map((v) => {
        const variant: any = {
          color: v.color,
          texture: v.texture,
          walletType: v.walletType,
          price: v.price,
          stock: v.stock,
          availability: v.availability,
        };
        if (v.id !== undefined) variant.id = v.id;
        if (v.sku !== undefined) variant.sku = v.sku;
        if (v.imgSrc !== undefined) variant.imgSrc = v.imgSrc ?? undefined;
        return variant;
      });

      const updatedProduct = await ProductService.updateProduct(
        id,
        name,
        description ?? null,
        isActive,
        categoryId,
        mappedVariants,
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
      const { id } = req.params as unknown as ProductParams;
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
