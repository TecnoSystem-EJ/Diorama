import "../config/enviroments.js";
import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { db } from "@diorama/db";

try {
  const email = process.env.ADMIN_EMAIL ?? "admin@diorama.local";
  const existing = await db.usuario.findUnique({ where: { email } });
  if (existing) {
    console.log(`Usuário ${email} já existe; senha e permissões preservadas.`);
  } else {
    const senha = process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");
    await db.usuario.create({ data: { email, username: "Administrador", role: "ADMIN", senhaHash: await bcrypt.hash(senha, 12) } });
    console.log(`Administrador criado: ${email}`);
    if (!process.env.ADMIN_PASSWORD) console.log(`Senha inicial: ${senha}`);
  }
} finally {
  await db.$disconnect();
}
