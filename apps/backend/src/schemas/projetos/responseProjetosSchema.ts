import * as z from "zod";
import projetosSchema from "./projetosSchema.js";

export const visualizarBlogResponseSchema = z
  .object({
    blog: projetosSchema,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;