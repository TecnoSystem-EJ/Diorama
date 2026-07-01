import * as z from "zod";

const projetosSchema = z
  .object({
    id: z
      .string()
      .openapi({ description: "ID (ObjectId) do projeto" }),

    titulo: z
      .string()
      .openapi({
        description: "Título do projeto",
        example: "Como começar com TypeScript",
      }),

    imagem_url: z
      .string()
      .openapi({
        description: "url da imagem do projeto",
      }),

    descricao_html: z
      .string()
      .openapi({
        description: "Descrição do projeto em HTML",
        example: "<h1>Meu projeto</h1><p>Conteúdo do projeto...</p>" 
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

export default projetosSchema;