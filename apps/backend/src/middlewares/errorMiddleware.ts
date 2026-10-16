import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { Prisma } from "@diorama/db";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ mensagem: error.issues.map(issue => issue.message).join(" ") });
  } else if (error instanceof multer.MulterError) {
    res.status(400).json({ mensagem: error.code === "LIMIT_FILE_SIZE" ? "Cada arquivo deve ter até 20 MB." : "Upload inválido." });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(error.code === "P2025" ? 404 : 400).json({ mensagem: error.code === "P2002" ? "Já existe um registro com esses dados." : "Registro não encontrado ou dados inválidos." });
  } else if (error.status === 400 || error instanceof SyntaxError) {
    res.status(400).json({ mensagem: "Dados inválidos." });
  } else {
    console.error("Falha na API:", error instanceof Error ? error.message : "erro desconhecido");
    res.status(500).json({ mensagem: "Não foi possível concluir a operação." });
  }
};
