import * as z from "zod";
import blogSchema from "./blogSchema.js";

export const visualizarBlogResponseSchema = z
  .object({
    blog: blogSchema,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;