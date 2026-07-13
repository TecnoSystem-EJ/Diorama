import { UsuarioRole } from "@diorama/db";

export interface TokenPayload {
    id: string;
    role: UsuarioRole;
}