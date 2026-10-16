import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/enviroments.js";
import { db } from "@diorama/db";
import type { TokenPayload } from "../@types/tokenPayload.js";


export function authMiddleware(req: Request, res: Response,next: NextFunction) {

    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({mensagem: "Token não enviado."});

    const [scheme, token] = authHeader.split(" ");

    if(!token) return res.status(401).json({mensagem: "Token não enviado."});
    if (scheme !== "Bearer") return res.status(401).json({mensagem: "Token inválido."});

    try {

        const decoded = jwt.verify(token, JWT_SECRET!);

        if (
            typeof decoded === "string" ||
            !Number.isInteger(decoded.id) || decoded.id <= 0 ||
            !["ADMIN", "AUTOR"].includes(decoded.role)
        ) {
            return res.status(401).json({
                mensagem: "Token inválido."
            });
        }

        req.user = decoded as TokenPayload;

        next();

    } catch {

        return res.status(401).json({
            mensagem: "Token inválido."
        });

    }
}

export async function activeUserMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await db.usuario.findUnique({ where: { id: req.user!.id, deleted: false } });
        if (!user) return res.status(401).json({ mensagem: "Sessão inválida. Entre novamente." });
        req.user = { id: user.id, role: user.role };
        next();
    } catch (error) {
        next(error);
    }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== "ADMIN") return res.status(403).json({ mensagem: "Acesso restrito a administradores." });
    next();
}

export const requireAdmin = [authMiddleware, activeUserMiddleware, adminMiddleware];
