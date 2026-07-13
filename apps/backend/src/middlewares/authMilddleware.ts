import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/enviroments.js";
import type { UsuarioRole } from "@diorama/db";
import type { TokenPayload } from "../@types/tokenPayload.js";


export function authMiddleware(req: Request, res: Response,next: NextFunction) {

    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({mensagem: "Token não enviado."});

    const [, token] = authHeader.split(" ");

    if(!token) return res.status(401).json({mensagem: "Token não enviado."});

    try {

        const decoded = jwt.verify(token, JWT_SECRET!);

        if (
            typeof decoded === "string" ||
            !("id" in decoded) ||
            !("role" in decoded)
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