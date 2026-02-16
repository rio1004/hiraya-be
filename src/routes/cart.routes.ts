import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { CartController } from "../controller/cart.controller.js";

const router = Router();
router.post("/add-to-cart", verifyFirebaseToken, CartController.addToCart);
router.get("/qty", verifyFirebaseToken, CartController.getCartQty);

export default router;
