import type { Request, Response } from "express";
import { OrderService } from "../service/order.service.js";

export const OrderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const { items, deliveryFee, addressId, newAddress } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid items provided" });
      }

      if (!addressId && !newAddress) {
        return res.status(400).json({ message: "An existing addressId or newAddress is required" });
      }

      // Basic validation for items
      for (const item of items) {
        if (!item.variantId || typeof item.quantity !== "number" || item.quantity <= 0) {
          return res.status(400).json({ message: "Invalid item variantId or quantity" });
        }
      }

      // Basic validation for newAddress if provided
      if (!addressId && newAddress) {
        const {
          barangayCode,
          cityCode,
          contactName,
          contactPhone,
          postalCode,
          regionCode,
          fullAddress,
        } = newAddress;

        if (!barangayCode || !cityCode || !contactName || !contactPhone || !postalCode || !regionCode || !fullAddress) {
          return res.status(400).json({ message: "Missing required fields in newAddress" });
        }
      }

      const order = await OrderService.placeOrder(userId, items, deliveryFee, { addressId, newAddress });
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const orders = await OrderService.getOrdersByUser(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid order ID provided" });
      }

      const order = await OrderService.getOrderById(id, userId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error: any) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
};
