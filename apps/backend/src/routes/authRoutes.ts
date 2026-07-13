import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

const authRoutes:Router = Router();
const controller = new AuthController();

authRoutes.post("/", controller.login);

export default authRoutes;