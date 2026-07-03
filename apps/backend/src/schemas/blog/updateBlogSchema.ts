import * as z from "zod";
import blogSchema from "./blogSchema";


const updateBlogSchema = z
  .object({
    request: z
      .object({
        titulo: z
          .string("O título deve ser uma string.")
          .nonempty("O título pode ser vazio")
          .optional(),

        conteudo_html: z
          .string("O conteúdo deve ser uma string.")
          .nonempty("O campo 'conteudo_html' pode ser vazio")
          .optional(),

        data_publicacao: z.iso
          .date("A data de publicação deve estar no formato ISO 8601.")
          .transform((date) => new Date(date))
          .optional(),
      })
      .strict(),

    response: z
      .object({
        mensagem: z.string(),
        blog: blogSchema,
      })
      .strict(),
  })
  .strict();