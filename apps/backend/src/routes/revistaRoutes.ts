import { Router } from "express";
import { RevistaController } from "../controllers/revistaController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { requireAdmin } from "../middlewares/authMilddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const revistaRoutes:Router = Router();
const controller = new RevistaController();

revistaRoutes.get("/", asyncHandler(controller.listar));

revistaRoutes.get("/:id", asyncHandler(controller.buscarPorId));

revistaRoutes.post("/", ...requireAdmin, uploadMiddleware.fields([
    {name:"revistaPdf", maxCount:1},
    {name:"imagemDestaque", maxCount:1}
]),asyncHandler(controller.criar));

revistaRoutes.put("/:id", ...requireAdmin, uploadMiddleware.fields([
    {name:"revistaPdf", maxCount:1},
    {name:"imagemDestaque", maxCount:1}
]), asyncHandler(controller.editar));

revistaRoutes.delete("/:id", ...requireAdmin, asyncHandler(controller.desativarRegistro));

export default revistaRoutes;
