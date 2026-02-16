import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        firebaseUid: string;
        email: string;
        role: Role;
        name?: string;
        uid: string;
      };
    }
  }
}
export {};
