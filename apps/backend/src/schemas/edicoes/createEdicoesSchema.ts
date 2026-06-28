import * as z from "zod";
import edicoesSchema from "./edicoesSchema";


const criarEdicoesSchema = z
  .object({
    request: z
      .object({

        numero_tag: z
        .string(" O número da tag deve ser uma string")
        .nonempty("O campo numero_tag é obrigatório")
        .nonoptional("O campo numero_tag é obrigatório"),

        titulo: z
          .string("O título deve ser uma string.")
          .nonempty("O campo 'titulo' é obrigatório.")
          .nonoptional("O campo 'titulo' é obrigatório."),


        capa: z
          .string("O texto da capa deve ser uma string")
          .nonoptional("O campo capa é obrigatório")
          
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