import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { syncUser } from "../controller/auth.controller.js";

const router = Router();

router.post("/firebase", verifyFirebaseToken, syncUser);

export default router;
