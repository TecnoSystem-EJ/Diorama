import * as z from "zod";
import edicoesSchema from "./edicoesSchema.js";

export const visualizarBlogResponseSchema = z
  .object({
    blog: edicoesSchema,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;