import "express";
import type { UsuarioRole } from "@diorama/db";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: number;
                role: UsuarioRole;
            };
        }
    }
}

export {};
