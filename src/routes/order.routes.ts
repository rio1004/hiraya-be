import { Router } from "express";
import { OrderController } from "../controller/order.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";

const router = Router();

// Apply auth middleware to all order routes
router.use(verifyFirebaseToken);

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getMyOrders);
router.get("/:id", OrderController.getOrderById);

export default router;
