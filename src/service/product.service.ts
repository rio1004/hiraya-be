import prisma from "../util/prisma.js";
import { AvailabilityStatus, WalletType } from "@prisma/client";

export const ProductService = {
  // Create a new product
  async createProduct(
    name: string,
    description: string | null,
    categoryId: string,
    variants: Array<{
      color: string;
      texture: string;
      walletType: WalletType;
      price: number;
      stock: number;
      availability: AvailabilityStatus;
      sku?: string;
      imgSrc?: string;
    }>,
  ) {
    return prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        variants: {
          create: variants.map((variant) => ({
            ...variant,
            price: parseFloat(variant.price.toFixed(2)), // Ensure price is correctly formatted
            sku: variant.sku ?? null,
            imgSrc: variant.imgSrc ?? null,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });
  },

  // Get all products with optional filters, pagination, and sorting
  async getProducts(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    walletType?: WalletType,
    color?: string,
    texture?: string,
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      };
    }

    if (inStock !== undefined) {
      where.variants = {
        some: {
          stock: { gt: 0 },
          availability: inStock ? AvailabilityStatus.IN_STOCK : undefined,
        },
      };
    }

    if (walletType || color || texture) {
      where.variants = {
        some: {
          ...(walletType && { walletType }),
          ...(color && { color: { contains: color, mode: "insensitive" } }),
          ...(texture && {
            texture: { contains: texture, mode: "insensitive" },
          }),
        },
      };
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      include: {
        category: true,
        variants: true,
      },
    });

    const totalProducts = await prisma.product.count({ where });

    return {
      products,
      currentPage: page,
      pageSize,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
    };
  },

  // Get a single product by ID
  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });
  },

  // Update an existing product
  async updateProduct(
    id: string,
    name?: string,
    description?: string | null,
    isActive?: boolean,
    categoryId?: string,
    variants?: Array<{
      id?: string; // Optional for updating existing variants
      color: string;
      texture: string;
      walletType: WalletType;
      price: number;
      stock: number;
      availability: AvailabilityStatus;
      sku?: string;
      imgSrc?: string;
    }>,
  ) {
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (isActive !== undefined) data.isActive = isActive;
    if (categoryId !== undefined) data.categoryId = categoryId;

    if (variants) {
      const updates = variants
        .filter((v) => v.id)
        .map((variant) =>
          prisma.productVariant.update({
            where: { id: variant.id as string },
            data: {
              color: variant.color,
              texture: variant.texture,
              walletType: variant.walletType,
              price: parseFloat(variant.price.toFixed(2)),
              stock: variant.stock,
              availability: variant.availability,
              sku: variant.sku ?? null,
              imgSrc: variant.imgSrc ?? null,
            },
          }),
        );

      const creates = variants
        .filter((v) => !v.id)
        .map((variant) =>
          prisma.productVariant.create({
            data: {
              productId: id,
              color: variant.color,
              texture: variant.texture,
              walletType: variant.walletType,
              price: parseFloat(variant.price.toFixed(2)),
              stock: variant.stock,
              availability: variant.availability,
              sku: variant.sku ?? null,
              imgSrc: variant.imgSrc ?? null,
            },
          }),
        );

      // Execute all updates and creations in a transaction
      await prisma.$transaction([...updates, ...creates]);
    }

    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: true,
      },
    });
  },

  // Delete a product
  async deleteProduct(id: string) {
    // Delete associated product variants first
    await prisma.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });

    return prisma.product.delete({
      where: { id },
    });
  },
};
