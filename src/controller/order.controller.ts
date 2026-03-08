import type { Request, Response } from "express";
import { OrderService } from "../service/order.service.js";
import type { CreateOrderInput, OrderParams } from "../types/order.type.js";

export const OrderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const { items, deliveryFee, addressId, newAddress } =
        req.body as CreateOrderInput;
      const userId = (req as any).user.id;

      const addressInfo: { addressId?: number; newAddress?: any } = {};
      if (addressId !== undefined) addressInfo.addressId = addressId;
      if (newAddress !== undefined) {
        addressInfo.newAddress = {
          barangayCode: newAddress.barangayCode,
          cityCode: newAddress.cityCode,
          contactName: newAddress.contactName,
          contactPhone: newAddress.contactPhone,
          isDefault: newAddress.isDefault,
          postalCode: newAddress.postalCode,
          provinceCode: newAddress.provinceCode ?? null,
          regionCode: newAddress.regionCode,
          fullAddress: newAddress.fullAddress,
        };
      }

      const order = await OrderService.placeOrder(
        userId,
        items,
        deliveryFee,
        addressInfo,
      );
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orders = await OrderService.getOrdersByUser(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params as unknown as OrderParams;

      const order = await OrderService.getOrderById(id, userId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error: any) {
      console.error("Error fetching order by ID:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
