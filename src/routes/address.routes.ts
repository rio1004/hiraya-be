import { Router } from "express";
import { AddressController } from "../controller/address.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addressParamsSchema,
  createAddressSchema,
  updateAddressSchema,
} from "../schemas/address.schema.js";

const router = Router();

// Apply auth middleware to all address routes
router.use(verifyFirebaseToken);

router.get("/", AddressController.getMyAddresses);
router.post(
  "/",
  validate(createAddressSchema),
  AddressController.createAddress,
);
router.put(
  "/:id",
  validate(updateAddressSchema),
  AddressController.updateAddress,
);
router.delete(
  "/:id",
  validate(addressParamsSchema),
  AddressController.deleteAddress,
);
router.put(
  "/:id/default",
  validate(addressParamsSchema),
  AddressController.setDefaultAddress,
);

export default router;
