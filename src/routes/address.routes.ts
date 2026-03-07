import { Router } from "express";
import { AddressController } from "../controller/address.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";

const router = Router();

// Apply auth middleware to all address routes
router.use(verifyFirebaseToken);

router.get("/", AddressController.getMyAddresses);
router.post("/", AddressController.createAddress);
router.put("/:id", AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);
router.put("/:id/default", AddressController.setDefaultAddress);

export default router;
