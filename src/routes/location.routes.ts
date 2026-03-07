import { Router } from "express";
import { LocationController } from "../controller/location.controller.js";

const router = Router();

// Regions
router.get("/regions", LocationController.getRegions);
router.get("/regions/:code", LocationController.getRegionByCode);

// Provinces
router.get("/provinces/:regionCode", LocationController.getProvincesByRegion);
router.get("/province/:code", LocationController.getProvinceByCode);

// Cities
router.get("/cities/province/:provinceCode", LocationController.getCitiesByProvince);
router.get("/cities/region/:regionCode", LocationController.getCitiesByRegion);
router.get("/cities/:code", LocationController.getCityByCode);

// Barangays
router.get("/barangays/:cityCode", LocationController.getBarangaysByCity);
router.get("/barangay/:code", LocationController.getBarangayByCode);

export default router;
