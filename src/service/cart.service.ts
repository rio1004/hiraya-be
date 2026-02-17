import prisma from "../util/prisma.js";

export const CartService = {
  async updateCartItemQty(userId: string, variantId: string, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      throw new Error("Variant not found");
    }
    if (variant.stock < quantity) {
      throw new Error("Not enough stock");
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const res = await prisma.cartItem.update({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      data: {
        quantity: quantity,
      },
    });
    return {
      success: true,
      message: res,
    };
  },
  async addToCart(userId: string, variantId: string, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    if (variant.stock < quantity) {
      throw new Error("Not enough stock");
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    await prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });

    return {
      success: true,
      message: "Successfully added to the cart",
    };
  },
  async getCartItems(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        items: {
          select: {
            variant: {
              select: {
                id: true,
                color: true,
                price: true,
                texture: true,
                stock: true,
                imgSrc: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            quantity: true,
          },
        },
      },
    });

    return { cart };
  },
  async getCartQty(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    let totalQuantity = 0;

    if (cart) {
      const sum = await prisma.cartItem.aggregate({
        _sum: {
          quantity: true,
        },
        where: { cartId: cart.id },
      });

      totalQuantity = sum._sum.quantity || 0;
    }

    return {
      totalQuantity,
    };
  },

  async deleteCartItem(userId: string, variantId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return prisma.cartItem.delete({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });
  },
};
