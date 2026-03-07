import type { Request, Response } from "express";
import { AddressService } from "../service/address.service.js";

export const AddressController = {
  async getMyAddresses(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const addresses = await AddressService.getAddressesByUser(userId);
      res.status(200).json(addresses);
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async createAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const {
        barangayCode,
        cityCode,
        contactName,
        contactPhone,
        isDefault,
        postalCode,
        provinceCode,
        regionCode,
        fullAddress,
      } = req.body;

      if (
        !barangayCode ||
        !cityCode ||
        !contactName ||
        !contactPhone ||
        !postalCode ||
        !regionCode ||
        !fullAddress
      ) {
        return res
          .status(400)
          .json({ message: "Missing required address fields" });
      }

      const newAddress = await AddressService.createAddress(userId, {
        barangayCode,
        cityCode,
        contactName,
        contactPhone,
        isDefault,
        postalCode,
        provinceCode,
        regionCode,
        fullAddress,
      });

      res.status(201).json(newAddress);
    } catch (error: any) {
      console.error("Error creating address:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async updateAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const updatedAddress = await AddressService.updateAddress(
        Number(id),
        userId,
        req.body,
      );
      res.status(200).json(updatedAddress);
    } catch (error: any) {
      console.error("Error updating address:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async deleteAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      await AddressService.deleteAddress(Number(id), userId);
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting address:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async setDefaultAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const updatedAddress = await AddressService.setDefaultAddress(
        Number(id),
        userId,
      );
      res.status(200).json(updatedAddress);
    } catch (error: any) {
      console.error("Error setting default address:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
