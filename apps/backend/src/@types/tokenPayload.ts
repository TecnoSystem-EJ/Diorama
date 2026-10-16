import type { UsuarioRole } from "@diorama/db";

export interface TokenPayload {
    id: number;
    role: UsuarioRole;
}
