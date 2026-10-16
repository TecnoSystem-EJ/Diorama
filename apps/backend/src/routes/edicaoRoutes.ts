import { Router } from "express";
import { EdicaoController } from "../controllers/edicaoController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { requireAdmin } from "../middlewares/authMilddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const edicaoRoutes:Router = Router();
const controller = new EdicaoController();

edicaoRoutes.get("/", asyncHandler(controller.listar));
edicaoRoutes.get("/:id", asyncHandler(controller.buscarPorId));
edicaoRoutes.post("/", ...requireAdmin, uploadMiddleware.single("capa"), asyncHandler(controller.criar));
edicaoRoutes.put("/:id", ...requireAdmin, uploadMiddleware.single("capa"), asyncHandler(controller.editar));
edicaoRoutes.delete("/:id", ...requireAdmin, asyncHandler(controller.desativarRegistro));

export default edicaoRoutes;
