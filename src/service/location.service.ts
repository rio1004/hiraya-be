import prisma from "../util/prisma.js";

export const LocationService = {
  // Region
  async getRegions() {
    return prisma.region.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getRegionByCode(code: string) {
    return prisma.region.findUnique({
      where: { code },
      include: {
        provinces: true,
        cities: true,
      },
    });
  },

  // Province
  async getProvincesByRegion(regionCode: string) {
    return prisma.province.findMany({
      where: { regionCode },
      orderBy: { name: "asc" },
    });
  },

  async getProvinceByCode(code: string) {
    return prisma.province.findUnique({
      where: { code },
      include: {
        cities: true,
      },
    });
  },

  // City
  async getCitiesByProvince(provinceCode: string) {
    return prisma.city.findMany({
      where: { provinceCode },
      orderBy: { name: "asc" },
    });
  },

  async getCitiesByRegion(regionCode: string) {
    return prisma.city.findMany({
      where: { regionCode, provinceCode: null },
      orderBy: { name: "asc" },
    });
  },

  async getCityByCode(code: string) {
    return prisma.city.findUnique({
      where: { code },
      include: {
        barangays: true,
      },
    });
  },

  // Barangay
  async getBarangaysByCity(cityCode: string) {
    return prisma.barangay.findMany({
      where: { cityCode },
      orderBy: { name: "asc" },
    });
  },

  async getBarangayByCode(code: string) {
    return prisma.barangay.findUnique({
      where: { code },
    });
  },
};
