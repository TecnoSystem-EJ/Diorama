import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware, activeUserMiddleware } from "../middlewares/authMilddleware.js";
import { db } from "@diorama/db";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRoutes:Router = Router();
const controller = new AuthController();

authRoutes.post("/", controller.login);
authRoutes.get("/me", authMiddleware, activeUserMiddleware, asyncHandler(async (req, res) => {
    const user = await db.usuario.findUniqueOrThrow({
        where: { id: req.user!.id, deleted: false },
        select: { id: true, username: true, email: true, role: true },
    });
    res.json({ user });
}));

export default authRoutes;
