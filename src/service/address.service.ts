import prisma from "../util/prisma.js";

export const AddressService = {
  async getAddressesByUser(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      include: {
        region: true,
        province: true,
        city: true,
        barangay: true,
      },
      orderBy: { isDefault: "desc" },
    });
  },

  async getAddressById(id: number, userId: string) {
    return prisma.address.findFirst({
      where: { id, userId },
      include: {
        region: true,
        province: true,
        city: true,
        barangay: true,
      },
    });
  },

  async createAddress(userId: string, data: any) {
    return await prisma.$transaction(async (tx) => {
      // If this is set as default, unset other default addresses
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Check if this is the user's first address, make it default if so
      const addressCount = await tx.address.count({ where: { userId } });
      const isDefault = addressCount === 0 ? true : !!data.isDefault;

      return tx.address.create({
        data: {
          ...data,
          userId,
          isDefault,
        },
        include: {
          region: true,
          province: true,
          city: true,
          barangay: true,
        },
      });
    });
  },

  async updateAddress(id: number, userId: string, data: any) {
    return await prisma.$transaction(async (tx) => {
      // If setting as default, unset others
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true, NOT: { id } },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id, userId },
        data,
        include: {
          region: true,
          province: true,
          city: true,
          barangay: true,
        },
      });
    });
  },

  async deleteAddress(id: number, userId: string) {
    const address = await prisma.address.findUnique({
      where: { id, userId },
    });

    if (!address) throw new Error("Address not found");

    const result = await prisma.address.delete({
      where: { id, userId },
    });

    // If we deleted the default address, make the most recent one default
    if (address.isDefault) {
      const latestAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (latestAddress) {
        await prisma.address.update({
          where: { id: latestAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return result;
  },

  async setDefaultAddress(id: number, userId: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id, userId },
        data: { isDefault: true },
      });
    });
  },
};
