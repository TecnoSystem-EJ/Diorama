import { Router } from "express";
import { EdicaoController } from "../controllers/edicaoController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const edicaoRoutes:Router = Router();
const controller = new EdicaoController();

edicaoRoutes.get("/", controller.listar);
edicaoRoutes.get("/:id", controller.buscarPorId);
edicaoRoutes.post("/", uploadMiddleware.single("capa"), controller.criar);
edicaoRoutes.put("/:id", controller.editar);
edicaoRoutes.delete("/:id", controller.desativarRegistro);

export default edicaoRoutes;