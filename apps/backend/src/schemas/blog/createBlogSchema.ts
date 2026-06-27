import * as z from "zod";
import blogSchema from "./blogSchema";

const criarBlogSchema = z
  .object({
    request: z
      .object({
        titulo: z
          .string("O título deve ser uma string.")
          .nonempty("O campo 'titulo' é obrigatório.")
          .nonoptional("O campo 'titulo' é obrigatório."),

        conteudo_html: z
          .string("O conteúdo deve ser uma string.")
          .nonempty("O campo 'conteudo_html' é obrigatório.")
          .nonoptional("O campo 'conteudo_html' é obrigatório."),

        data_publicacao: z.iso
          .date("A data de publicação deve estar no formato ISO 8601.")
          .nonoptional("O campo 'data_publicacao' é obrigatório.")
          .transform((date) => new Date(date)),
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