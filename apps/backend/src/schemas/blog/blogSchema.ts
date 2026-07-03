import * as z from "zod";

const blogSchema = z
  .object({
    id: z
      .string()
      .openapi({ description: "ID (ObjectId) do blog" }),

    titulo: z
      .string()
      .openapi({
        description: "Título da publicação",
        example: "Como começar com TypeScript",
      }),

    conteudo_html: z
      .string()
      .openapi({
        description: "Conteúdo da publicação em HTML",
        example: "<h1>Meu artigo</h1><p>Conteúdo do blog...</p>",
      }),

    data_publicacao: z
      .date()
      .openapi({
        description: "Data de publicação do blog",
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

export default blogSchema;