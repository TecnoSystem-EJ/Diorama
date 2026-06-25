import "dotenv/config";

export const PORT = Number(process.env.PORT) || 3001;
export const CONTAINER_NAME = String(process.env.CONTAINER_NAME);
export const DB_NAME = String(process.env.DB_NAME);
export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DB_USER = String(process.env.DB_USER);
