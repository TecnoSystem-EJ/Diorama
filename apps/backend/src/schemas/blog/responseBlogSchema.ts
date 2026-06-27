import * as z from "zod";
import blogSchema from "./blogSchema";

export const visualizarBlogResponseSchema = z
  .object({
    blog: blogSchema,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;