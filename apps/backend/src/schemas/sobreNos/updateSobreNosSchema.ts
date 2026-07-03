import * as z from "zod";
import sobreNosSchema from "./sobreNosSchema";


const updateSobreNosSchema = z
  .object({
    request: z
      .object({

        texto_completo_html: z
        .string(" O texto_completo_html ser uma string")
        .nonempty("O campo texto_completo_html pode ser vazio")
        .optional()
          
      })
      .strict(),

    response: z
      .object({
        mensagem: z.string(),
        sobreNos: sobreNosSchema,
      })
      .strict(),
  })
  .strict();