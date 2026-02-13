import prisma from "../util/prisma.js";

export const CategoryService = {
  async createCategory(name: string) {
    return prisma.category.create({
      data: {
        name,
      },
    });
  },
};
