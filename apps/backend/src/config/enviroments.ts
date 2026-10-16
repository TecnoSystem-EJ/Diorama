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
