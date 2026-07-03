import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Estende o Zod globalmente
extendZodWithOpenApi(z);

export { z };
