import { jest } from "@jest/globals";
import fs from "fs";
import os from "os";
import path from "path";
import { fileUtils } from "../../utils/fileUtils.js";

describe("fileUtils", () => {
  describe("apagarArquivo", () => {
    it("nao deve fazer nada se o caminho for undefined", () => {
      expect(() => fileUtils.apagarArquivo(undefined)).not.toThrow();
    });

    it("nao deve lancar erro se o arquivo nao existir (caminho inexistente)", () => {
      const caminhoInexistente = path.join(os.tmpdir(), "arquivo_que_nao_existe.png");

      expect(() => fileUtils.apagarArquivo(caminhoInexistente)).not.toThrow();
      expect(fs.existsSync(caminhoInexistente)).toBe(false);
    });

    it("deve apagar o arquivo se ele existir", () => {
      const tmp = path.join(os.tmpdir(), "diorama_test_apagar.png");
      fs.writeFileSync(tmp, "conteudo");

      expect(fs.existsSync(tmp)).toBe(true);

      fileUtils.apagarArquivo(tmp);

      expect(fs.existsSync(tmp)).toBe(false);
    });

    it("nao deve lancar erro quando o caminho for uma string vazia", () => {
      expect(() => fileUtils.apagarArquivo("")).not.toThrow();
    });
  });
});
