import { Router } from "express";
import { LocationController } from "../controller/location.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  cityCodeParamsSchema,
  locationParamsSchema,
  provinceCodeParamsSchema,
  regionCodeParamsSchema,
} from "../schemas/location.schema.js";

const router = Router();

// Regions
router.get("/regions", LocationController.getRegions);
router.get(
  "/regions/:code",
  validate(locationParamsSchema),
  LocationController.getRegionByCode,
);

// Provinces
router.get(
  "/provinces/region/:regionCode",
  validate(regionCodeParamsSchema),
  LocationController.getProvincesByRegion,
);
router.get(
  "/provinces/code/:code",
  validate(locationParamsSchema),
  LocationController.getProvinceByCode,
);

// Cities
router.get(
  "/cities/province/:provinceCode",
  validate(provinceCodeParamsSchema),
  LocationController.getCitiesByProvince,
);
router.get(
  "/cities/region/:regionCode",
  validate(regionCodeParamsSchema),
  LocationController.getCitiesByRegion,
);
router.get(
  "/cities/code/:code",
  validate(locationParamsSchema),
  LocationController.getCityByCode,
);

// Barangays
router.get(
  "/barangays/city/:cityCode",
  validate(cityCodeParamsSchema),
  LocationController.getBarangaysByCity,
);
router.get(
  "/barangays/code/:code",
  validate(locationParamsSchema),
  LocationController.getBarangayByCode,
);

export default router;
