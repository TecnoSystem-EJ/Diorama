import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController.js";

const usuarioRoutes:Router = Router();
const controller = new UsuarioController();

usuarioRoutes.get("/", controller.listar);
usuarioRoutes.get("/:email", controller.buscarPorEmail);
usuarioRoutes.post("/", controller.criar);
usuarioRoutes.put("/:id", controller.editar);
usuarioRoutes.delete("/:id", controller.desativarRegistro);

export default usuarioRoutes;