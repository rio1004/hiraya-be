import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { CartController } from "../controller/cart.controller.js";

const router = Router();
router.get("/", verifyFirebaseToken, CartController.getCartItems);
router.post("/add-to-cart", verifyFirebaseToken, CartController.addToCart);
router.put("/update-cart", verifyFirebaseToken, CartController.updateCartQty);
router.get("/qty", verifyFirebaseToken, CartController.getCartQty);
router.delete("/items/:variantId", verifyFirebaseToken, CartController.deleteCartItem);

export default router;
