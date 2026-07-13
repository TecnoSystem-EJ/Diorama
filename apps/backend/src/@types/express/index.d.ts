import "express";
import { UsuarioRole } from "@diorama/db";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: UsuarioRole;
            };
        }
    }
}

export {};