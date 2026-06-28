import * as z from "zod";

const edicoesSchema = z
  .object({
    id: z
      .string()
      .openapi({ description: "ID (ObjectId) do blog" }),

    numero_tag: z
      .string()
      .openapi({
        description: "Número da edição",
        example: "Edição 1",
      }),

    titulo: z
      .string()
      .openapi({
        description: "Título da edição",
        example: "Meu título",
      }),

    capa: z
      .string()
      .openapi({
        description: "Capa da edição",
      }),

    createdAt: z
      .date()
      .openapi({
        description: "Data de criação do registro",
      }),

    updatedAt: z
      .date()
      .openapi({
        description: "Data da última atualização do registro",
      }),
  })
  .strict();

export default edicoesSchema;