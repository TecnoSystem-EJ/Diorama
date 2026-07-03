import * as z from "zod";
import edicoesSchema from "./edicoesSchema";

export const visualizarBlogResponseSchema = z
  .object({
    blog: edicoesSchema,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;