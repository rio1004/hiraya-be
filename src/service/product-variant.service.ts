import type { AvailabilityStatus, WalletType } from "@prisma/client";
import prisma from "../util/prisma.js";

export const ProductVariantService = {
  async addProductVariant(
    productId: string,
    variants: {
      color: string;
      texture: string;
      walletType: WalletType;
      price: number;
      stock: number;
      availability: AvailabilityStatus;
      sku?: string;
      imgSrc?: string;
    },
  ) {
    return prisma.productVariant.create({
      data: { ...variants, productId },
    });
  },
};
