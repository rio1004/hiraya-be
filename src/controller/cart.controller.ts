import type { Request, Response } from "express";
import { CartService } from "../service/cart.service.js";
import type {
  AddToCartInput,
  DeleteCartItemParams,
  UpdateCartQtyInput,
} from "../types/cart.type.js";

export const CartController = {
  async addToCart(req: Request, res: Response) {
    try {
      const { variantId, quantity = 1 } = req.body as AddToCartInput;
      const userId = (req as any).user.id;

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
      const userId = (req as any).user.id;

      let ids: string[] | undefined;

      if (
        req.body?.ids &&
        Array.isArray(req.body.ids) &&
        req.body.ids.length > 0
      ) {
        ids = req.body.ids;
      } else if (req.query?.ids && typeof req.query.ids === "string") {
        ids = req.query.ids.split(",").filter(Boolean); // removes empty strings
        if (ids.length === 0) ids = undefined;
      }
      const result = await CartService.getCartItems(userId, ids);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getCartQty(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const qty = await CartService.getCartQty(userId);

      res.status(200).json({ qty });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async updateCartQty(req: Request, res: Response) {
    try {
      const { variantId, quantity = 1 } = req.body as UpdateCartQtyInput;
      const userId = (req as any).user.id;
      const cart = await CartService.updateCartItemQty(
        userId,
        variantId,
        quantity,
      );
      res.status(200).json({ cart });
    } catch (error: any) {
      if (error.message === "Variant not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Not enough stock") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async deleteCartItem(req: Request, res: Response) {
    try {
      const { variantId } = req.params as unknown as DeleteCartItemParams;
      const userId = (req as any).user.id;
      const deletedItem = await CartService.deleteCartItem(userId, variantId);

      res.status(200).json({ success: true, deletedItem });
    } catch (error: any) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
