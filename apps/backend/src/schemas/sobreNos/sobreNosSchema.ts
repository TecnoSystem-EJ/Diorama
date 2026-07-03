import * as z from "zod";

const sobreNosSchema = z
  .object({
    id: z
      .string()
      .openapi({ description: "ID (ObjectId) do blog" }),

    texto_completo_html: z
      .string()
      .openapi({
        description: "Texto completo html"
      }),

    updatedAt: z
      .date()
      .openapi({
        description: "Data da última atualização do registro",
      }),
  })
  .strict();

export default sobreNosSchema;