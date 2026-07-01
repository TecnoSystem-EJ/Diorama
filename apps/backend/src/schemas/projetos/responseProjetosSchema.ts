import * as z from "zod";
import projetosSchema from "./projetosSchema";

export const visualizarBlogResponseSchema = z
  .object({
    blog: projetosSchema,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;