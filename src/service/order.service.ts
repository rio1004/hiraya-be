import prisma from "../util/prisma.js";
import { Prisma } from "@prisma/client";
import { AddressService } from "./address.service.js";

export const OrderService = {
  async placeOrder(
    userId: string,
    items: Array<{ variantId: string; quantity: number }>,
    deliveryFee: number = 0,
    addressInfo: { addressId?: number; newAddress?: any },
  ) {
    return await prisma.$transaction(async (tx) => {
      let addressId = addressInfo.addressId;

      // Handle new address creation if provided
      if (!addressId && addressInfo.newAddress) {
        // We reuse the logic from AddressService but use the current transaction
        // Since AddressService.createAddress uses its own transaction, 
        // we'll manually implement it here for atomic safety.

        if (addressInfo.newAddress.isDefault) {
          await tx.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
          });
        }

        const addressCount = await tx.address.count({ where: { userId } });
        const isDefault = addressCount === 0 ? true : !!addressInfo.newAddress.isDefault;

        const createdAddress = await tx.address.create({
          data: {
            ...addressInfo.newAddress,
            userId,
            isDefault,
          },
        });
        addressId = createdAddress.id;
      }

      if (!addressId) {
        throw new Error("An address is required to place an order");
      }

      let totalAmount = new Prisma.Decimal(0);
      const orderItemsData = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new Error(`Variant with ID ${item.variantId} not found`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for variant ${variant.id}`);
        }

        // Update stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        const itemTotal = variant.price.mul(item.quantity);
        totalAmount = totalAmount.add(itemTotal);

        orderItemsData.push({
          variantId: item.variantId,
          quantity: item.quantity,
          price: variant.price,
        });
      }

      totalAmount = totalAmount.add(new Prisma.Decimal(deliveryFee));

      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          status: "PENDING",
          total: totalAmount,
          deliveryFee: new Prisma.Decimal(deliveryFee),
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
          address: true,
        },
      });

      // Clear the user's cart after successful order placement
      const cart = await tx.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return order;
    });
  },

  async getOrdersByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        address: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getOrderById(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        address: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  },
};
