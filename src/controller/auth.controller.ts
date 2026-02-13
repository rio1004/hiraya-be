import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../util/prisma.js";
import jwt from "jsonwebtoken";

export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    const { uid, email, name } = req.user;

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
