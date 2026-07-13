import { Router } from "express";
import { RevistaController } from "../controllers/revistaController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMilddleware.js";

const revistaRoutes:Router = Router();
const controller = new RevistaController();

revistaRoutes.get("/",controller.listar);

revistaRoutes.get("/:id", controller.buscarPorId);

revistaRoutes.post("/", authMiddleware ,uploadMiddleware.fields([
    {name:"revistaPdf", maxCount:1},
    {name:"imagemDestaque", maxCount:1}
]),controller.criar);

revistaRoutes.put("/:id", authMiddleware, uploadMiddleware.fields([
    {name:"revistaPdf", maxCount:1},
    {name:"imagemDestaque", maxCount:1}
]), controller.editar);

revistaRoutes.delete("/:id", authMiddleware, controller.desativarRegistro);

export default revistaRoutes;