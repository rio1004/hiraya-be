import type { Request, Response } from "express";
import { CartService } from "../service/cart.service.js";

export const CartController = {
  async addToCart(req: Request, res: Response) {
    try {
      const { variantId, quantity = 1 } = req.body;
      const userId = req.user.id;

      const cart = await CartService.addToCart(userId, variantId, quantity);

      res.status(200).json(cart);
    } catch (error: any) {
      if (error.message === "Variant not found") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Not enough stock") {
        return res.status(400).json({ message: error.message });
      }

      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  async getCartItems(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      res.status(200).json(await CartService.getCartItems(userId));
    } catch (error) {}
  },
  async getCartQty(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;
      const qty = await CartService.getCartQty(userId);

      res.status(200).json({ qty });
    } catch (error) {}
  },
  async updateCartQty(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { variantId, quantity = 1 } = req.body;
      const userId = req.user.id;
      const cart = await CartService.updateCartItemQty(
        userId,
        variantId,
        quantity,
      );
      console.log(cart);
      res.status(200).json({ cart });
    } catch (error: any) {
      if (error.message === "Variant not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Not enough stock") {
        return res.status(400).json({ message: error.message });
      }
    }
  },
  async deleteCartItem(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { variantId } = req.params;
      if (!variantId || typeof variantId !== "string") {
        return res.status(400).json({ message: "Invalid variantId" });
      }

      const userId = req.user.id;
      const deletedItem = await CartService.deleteCartItem(userId, variantId);

      res.status(200).json({ success: true, deletedItem });
    } catch (error) {}
  },
};
