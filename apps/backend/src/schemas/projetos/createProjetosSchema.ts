import * as z from "zod";
import projetosSchema from "./projetosSchema";


const criarProjetosSchema = z
  .object({
    request: z
      .object({

        titulo: z
          .string("O título deve ser uma string.")
          .nonempty("O campo 'titulo' é obrigatório.")
          .nonoptional("O campo 'titulo' é obrigatório."),

        
        imagem_url: z
        .string("A imagem_url deve ser uma string")
        .nonempty("O campo imagem_url é obrigatório")
        .nonoptional("O campo imagem_url é obrigatório"),


        descricao_html: z
          .string("O texto da capa deve ser uma string")
          .nonempty("O campo imagem_url é obrigatório")
          .nonoptional("O campo imagem_url é obrigatório")
          
      })
      .strict(),

    response: z
      .object({
        mensagem: z.string(),
        projeto: projetosSchema,
      })
      .strict(),
  })
  .strict();