import * as z from "zod";
import edicoesSchema from "./edicoesSchema";


const criarEdicoesSchema = z
  .object({
    request: z
      .object({

        numero_tag: z
        .string(" O número da tag deve ser uma string")
        .nonempty("O campo numero_tag pode ser vazio")
        .optional(),

        titulo: z
          .string("O título deve ser uma string.")
          .nonempty("O campo 'titulo' pode ser vazio")
          .optional(),


        capa: z
          .string("O texto da capa deve ser uma string")
          .nonempty("O campo capa pode ser vazio")
          .optional()
          
      })
      .strict(),

    response: z
      .object({
        mensagem: z.string(),
        edicao: edicoesSchema,
      })
      .strict(),
  })
  .strict();