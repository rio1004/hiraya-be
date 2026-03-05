import prisma from "../util/prisma.js";
import { Prisma } from "@prisma/client";

export const OrderService = {
  async placeOrder(
    userId: string,
    items: Array<{ variantId: string; quantity: number }>,
    deliveryFee: number = 0,
  ) {
    return await prisma.$transaction(async (tx) => {
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
          status: "PENDING",
          total: totalAmount,
          deliveryFee: new Prisma.Decimal(deliveryFee),
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
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
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
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

    return orders.map((order) => {
      const subTotal = order.items.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity;
      }, 0);

      const deliveryFee = Number(order.deliveryFee ?? 0);

      const totalPrice = subTotal + deliveryFee;

      return {
        subTotal,
        deliveryFee,
        totalPrice,
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
          productName: item.variant.product.name,
          color: item.variant.color,
          texture: item.variant.texture,
          walletType: item.variant.walletType,
          image: item.variant.imgSrc,
        })),
      };
    });
  },

  async getOrderById(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
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
