import * as z from "zod";
import sobreNosSchema from "./sobreNosSchema.js";

export const visualizarBlogResponseSchema = z
  .object({
    sobreNos: sobreNosSchema ,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;