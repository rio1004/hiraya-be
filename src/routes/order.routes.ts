import { Router } from "express";
import { OrderController } from "../controller/order.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderSchema,
  getOrderParamsSchema,
} from "../schemas/order.schema.js";

const router = Router();

// Apply auth middleware to all order routes
router.use(verifyFirebaseToken);

router.post("/", validate(createOrderSchema), OrderController.createOrder);
router.get("/", OrderController.getMyOrders);
router.get(
  "/:id",
  validate(getOrderParamsSchema),
  OrderController.getOrderById,
);

export default router;
