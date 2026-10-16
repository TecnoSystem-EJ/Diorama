import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController.js";
import { requireAdmin } from "../middlewares/authMilddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const usuarioRoutes:Router = Router();
const controller = new UsuarioController();

usuarioRoutes.use(...requireAdmin);
usuarioRoutes.get("/", asyncHandler(controller.listar));
usuarioRoutes.get("/:email", asyncHandler(controller.buscarPorEmail));
usuarioRoutes.post("/", asyncHandler(controller.criar));
usuarioRoutes.put("/:id", asyncHandler(controller.editar));
usuarioRoutes.delete("/:id", asyncHandler(controller.desativarRegistro));

export default usuarioRoutes;
