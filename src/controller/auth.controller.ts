import type { Request, Response } from "express";
import prisma from "../util/prisma.js";
import jwt from "jsonwebtoken";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    const name = req.user.name ?? null;
    const uid = req.user.uid ?? null;

    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        email,
        name,
      },
      create: {
        firebaseUid: uid,
        email,
        name,
      },
    });
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Error syncing user" });
  }
};
