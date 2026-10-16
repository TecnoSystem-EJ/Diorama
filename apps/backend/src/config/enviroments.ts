import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

export const PORT = Number(process.env.PORT) || 3001;
export const CONTAINER_NAME = process.env.CONTAINER_NAME ?? "diorama_db";
export const DB_NAME = process.env.DB_NAME ?? "diorama_db";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_USER = process.env.DB_USER ?? "diorama_admin";
const configuredSecret = process.env.JWT_SECRET;
if (!configuredSecret?.trim()) {
  throw new Error("Defina JWT_SECRET no arquivo apps/backend/.env antes de iniciar a API.");
}
export const JWT_SECRET: string = configuredSecret;
export const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:3000";
export const PUBLIC_API_URL = process.env.PUBLIC_API_URL ?? `http://localhost:${PORT}`;
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? fileURLToPath(new URL("../../static/", import.meta.url));

if (process.env.NODE_ENV === "production") {
  if (JWT_SECRET.length < 32) throw new Error("JWT_SECRET deve ter pelo menos 32 caracteres em produção.");
  for (const [name, value] of [["WEB_ORIGIN", WEB_ORIGIN], ["PUBLIC_API_URL", PUBLIC_API_URL]]) {
    if (!value?.startsWith("https://")) throw new Error(`${name} deve usar HTTPS em produção.`);
  }
}
