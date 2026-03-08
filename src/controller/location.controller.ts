import type { Request, Response } from "express";
import { LocationService } from "../service/location.service.js";
import type {
  CityCodeParams,
  LocationParams,
  ProvinceCodeParams,
  RegionCodeParams,
} from "../types/location.type.js";

export const LocationController = {
  // Region
  async getRegions(req: Request, res: Response) {
    try {
      const regions = await LocationService.getRegions();
      res.status(200).json(regions);
    } catch (error: any) {
      console.error("Error fetching regions:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getRegionByCode(req: Request, res: Response) {
    try {
      const { code } = req.params as unknown as LocationParams;
      const region = await LocationService.getRegionByCode(code);
      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }
      res.status(200).json(region);
    } catch (error: any) {
      console.error("Error fetching region by code:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Province
  async getProvincesByRegion(req: Request, res: Response) {
    try {
      const { regionCode } = req.params as unknown as RegionCodeParams;
      const provinces = await LocationService.getProvincesByRegion(regionCode);
      res.status(200).json(provinces);
    } catch (error: any) {
      console.error("Error fetching provinces by region:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getProvinceByCode(req: Request, res: Response) {
    try {
      const { code } = req.params as unknown as LocationParams;
      const province = await LocationService.getProvinceByCode(code);
      if (!province) {
        return res.status(404).json({ message: "Province not found" });
      }
      res.status(200).json(province);
    } catch (error: any) {
      console.error("Error fetching province by code:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // City
  async getCitiesByProvince(req: Request, res: Response) {
    try {
      const { provinceCode } = req.params as unknown as ProvinceCodeParams;
      const cities = await LocationService.getCitiesByProvince(provinceCode);
      res.status(200).json(cities);
    } catch (error: any) {
      console.error("Error fetching cities by province:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getCitiesByRegion(req: Request, res: Response) {
    try {
      const { regionCode } = req.params as unknown as RegionCodeParams;
      const cities = await LocationService.getCitiesByRegion(regionCode);
      res.status(200).json(cities);
    } catch (error: any) {
      console.error("Error fetching cities by region:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getCityByCode(req: Request, res: Response) {
    try {
      const { code } = req.params as unknown as LocationParams;
      const city = await LocationService.getCityByCode(code);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.status(200).json(city);
    } catch (error: any) {
      console.error("Error fetching city by code:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Barangay
  async getBarangaysByCity(req: Request, res: Response) {
    try {
      const { cityCode } = req.params as unknown as CityCodeParams;
      const barangays = await LocationService.getBarangaysByCity(cityCode);
      res.status(200).json(barangays);
    } catch (error: any) {
      console.error("Error fetching barangays by city:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getBarangayByCode(req: Request, res: Response) {
    try {
      const { code } = req.params as unknown as LocationParams;
      const barangay = await LocationService.getBarangayByCode(code);
      if (!barangay) {
        return res.status(404).json({ message: "Barangay not found" });
      }
      res.status(200).json(barangay);
    } catch (error: any) {
      console.error("Error fetching barangay by code:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
