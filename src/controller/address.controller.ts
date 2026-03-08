import type { Request, Response } from "express";
import { AddressService } from "../service/address.service.js";
import type {
  AddressParams,
  CreateAddressInput,
  UpdateAddressInput,
} from "../types/address.type.js";

export const AddressController = {
  async getMyAddresses(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
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
      const userId = (req as any).user.id;
      const data = req.body as CreateAddressInput;

      const newAddress = await AddressService.createAddress(userId, {
        barangayCode: data.barangayCode,
        cityCode: data.cityCode,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        isDefault: data.isDefault,
        postalCode: data.postalCode,
        provinceCode: data.provinceCode ?? null,
        regionCode: data.regionCode,
        fullAddress: data.fullAddress,
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
      const userId = (req as any).user.id;
      const { id } = req.params as unknown as AddressParams;
      const body = req.body as UpdateAddressInput;

      const updatedAddress = await AddressService.updateAddress(
        id, // This is now a number because of the transform in Zod and our validate middleware
        userId,
        body,
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
      const userId = (req as any).user.id;
      const { id } = req.params as unknown as AddressParams;

      await AddressService.deleteAddress(id, userId);
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
      const userId = (req as any).user.id;
      const { id } = req.params as unknown as AddressParams;

      const updatedAddress = await AddressService.setDefaultAddress(id, userId);
      res.status(200).json(updatedAddress);
    } catch (error: any) {
      console.error("Error setting default address:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
