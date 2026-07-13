import * as z from "zod";
import sobreNosSchema from "./sobreNosSchema";

export const visualizarBlogResponseSchema = z
  .object({
    sobreNos: sobreNosSchema ,
  })
  .strict();

export type VisualizarBlogResponseSchema = z.infer<
  typeof visualizarBlogResponseSchema
>;