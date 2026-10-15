import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const serviceInstance = {
  listar: jest.fn(),
  buscar: jest.fn(),
  cadastrar: jest.fn(),
  editar: jest.fn(),
  desativarRegistro: jest.fn(),
};

await jest.unstable_mockModule("../../services/revistaService.js", () => ({
  RevistaService: jest.fn(() => serviceInstance),
}));

await jest.unstable_mockModule("../../utils/fileUtils.js", () => ({
  fileUtils: { apagarArquivo: jest.fn() },
}));

const { fileUtils } = await import("../../utils/fileUtils.js");
const { RevistaController } = await import("../../controllers/revistaController.js");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;
}

function mockReq(body: any = {}, params: any = {}, files: any = undefined) {
  return {
    body,
    params,
    files,
    protocol: "http",
    get: jest.fn().mockReturnValue("localhost:3001"),
  } as any;
}

describe("RevistaController", () => {
  const controller = new RevistaController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listar", () => {
    it("deve retornar a lista de revistas com a quantidade", async () => {
      const revistas = [{ id: "1" }, { id: "2" }];
      serviceInstance.listar.mockResolvedValue(revistas);

      const req = mockReq();
      const res = mockRes();

      await controller.listar(req, res);

      expect(serviceInstance.listar).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ quantidade: 2, revistas });
    });

    it("deve retornar quantidade 0 quando nao houver revistas", async () => {
      serviceInstance.listar.mockResolvedValue([]);

      const req = mockReq();
      const res = mockRes();

      await controller.listar(req, res);

      expect(res.json).toHaveBeenCalledWith({ quantidade: 0, revistas: [] });
    });
  });

  describe("buscarPorId", () => {
    it("deve retornar 400 se o id nao for fornecido", async () => {
      const req = mockReq({}, { id: "" });
      const res = mockRes();

      await controller.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "O id não foi fornecido." });
    });

    it("deve retornar 404 se a revista nao for encontrada", async () => {
      serviceInstance.buscar.mockResolvedValue(null);

      const req = mockReq({}, { id: "999" });
      const res = mockRes();

      await controller.buscarPorId(req, res);

      expect(serviceInstance.buscar).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Revista não encontrada." });
    });

    it("deve retornar a revista encontrada", async () => {
      const revista = { id: "1", titulo: "Revista 1" };
      serviceInstance.buscar.mockResolvedValue(revista);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await controller.buscarPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({ revista });
    });
  });

  describe("criar", () => {
    it("deve retornar 400 se o pdf da revista nao for enviado", async () => {
      const req = mockReq(
        { edicaoId: "1", titulo: "Titulo", conteudo_html: "<p>html</p>" },
        {},
        { imagemDestaque: [{ path: "/tmp/img.png" }] }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "É necessário enviar a imagem de destaque e o pdf da revista.",
      });
      expect(fileUtils.apagarArquivo).toHaveBeenCalled();
    });

    it("deve retornar 400 se a imagem de destaque nao for enviada", async () => {
      const req = mockReq(
        { edicaoId: "1", titulo: "Titulo", conteudo_html: "<p>html</p>" },
        {},
        { revistaPdf: [{ path: "/tmp/file.pdf" }] }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "É necessário enviar a imagem de destaque e o pdf da revista.",
      });
    });

    it("deve retornar 400 se os parametros forem insuficientes", async () => {
      const req = mockReq(
        { titulo: "Titulo" },
        {},
        {
          revistaPdf: [{ path: "/tmp/file.pdf", filename: "file.pdf" }],
          imagemDestaque: [{ path: "/tmp/img.png", filename: "img.png" }],
        }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Parâmetros insuficientes." });
      expect(fileUtils.apagarArquivo).toHaveBeenCalledTimes(2);
    });

    it("deve criar a revista com sucesso (201) quando os arquivos e dados forem validos", async () => {
      const revistaCriada = { id: "1", titulo: "Titulo" };
      serviceInstance.cadastrar.mockResolvedValue(revistaCriada);

      const req = mockReq(
        { edicaoId: "ed-1", titulo: "Titulo", conteudo_html: "<p>html</p>" },
        {},
        {
          revistaPdf: [{ path: "/tmp/file.pdf", filename: "file.pdf" }],
          imagemDestaque: [{ path: "/tmp/img.png", filename: "img.png" }],
        }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(serviceInstance.cadastrar).toHaveBeenCalledWith({
        edicaoId: "ed-1",
        titulo: "Titulo",
        conteudo_html: "<p>html</p>",
        imagemDestaque: "http://localhost:3001/static/imagemDestaqueRevistas/img.png",
        pdfUrl: "http://localhost:3001/static/pdfRevistas/file.pdf",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Revista Cadastrada com sucesso!",
        revista: revistaCriada,
      });
    });

    it("deve retornar 400 e apagar os arquivos se o service lancar erro", async () => {
      const erro = new Error("Falha ao criar");
      serviceInstance.cadastrar.mockRejectedValue(erro);

      const req = mockReq(
        { edicaoId: "ed-1", titulo: "Titulo", conteudo_html: "<p>html</p>" },
        {},
        {
          revistaPdf: [{ path: "/tmp/file.pdf", filename: "file.pdf" }],
          imagemDestaque: [{ path: "/tmp/img.png", filename: "img.png" }],
        }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/file.pdf");
      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/img.png");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro });
    });
  });

  describe("editar", () => {
    it("deve retornar 400 se o id nao for fornecido", async () => {
      const req = mockReq({}, { id: "" }, {});
      const res = mockRes();

      await controller.editar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "O id não foi fornecido." });
    });

    it("deve retornar 400 se nenhum dado for fornecido para alteracao", async () => {
      const req = mockReq({}, { id: "1" }, {});
      const res = mockRes();

      await controller.editar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Nenhum dado foi fornecido para alteração do regsitro.",
      });
    });

    it("deve editar a revista com sucesso quando titulo for enviado", async () => {
      const revistaEditada = { id: "1", titulo: "Novo Titulo" };
      serviceInstance.editar.mockResolvedValue(revistaEditada);

      const req = mockReq({ titulo: "Novo Titulo" }, { id: "1" }, {});
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith("1", { titulo: "Novo Titulo" });
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Revista editada com sucesso!",
        revista: revistaEditada,
      });
    });

    it("deve editar imagemDestaque e pdfUrl quando os arquivos forem enviados", async () => {
      const revistaEditada = { id: "1" };
      serviceInstance.editar.mockResolvedValue(revistaEditada);

      const req = mockReq(
        { titulo: "Novo" },
        { id: "1" },
        {
          imagemDestaque: [{ path: "/tmp/img.png", filename: "img2.png" }],
          revistaPdf: [{ path: "/tmp/file.pdf", filename: "file2.pdf" }],
        }
      );
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith("1", {
        titulo: "Novo",
        imagemDestaque: "http://localhost:3001/static/imagemDestaqueRevistas/img2.png",
        pdfUrl: "http://localhost:3001/static/pdfRevistas/file2.pdf",
      });
    });

    it("deve retornar 400 e apagar arquivos se o service lancar erro ao editar", async () => {
      const erro = new Error("Falha ao editar");
      serviceInstance.editar.mockRejectedValue(erro);

      const req = mockReq(
        { titulo: "Novo" },
        { id: "1" },
        {
          revistaPdf: [{ path: "/tmp/file.pdf", filename: "file2.pdf" }],
          imagemDestaque: [{ path: "/tmp/img.png", filename: "img2.png" }],
        }
      );
      const res = mockRes();

      await controller.editar(req, res);

      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/file.pdf");
      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/img.png");
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("desativarRegistro", () => {
    it("deve retornar 400 se o id nao for fornecido", async () => {
      const req = mockReq({}, { id: "" });
      const res = mockRes();

      await controller.desativarRegistro(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "O id não foi fornecido." });
    });

    it("deve desativar o registro com sucesso", async () => {
      serviceInstance.desativarRegistro.mockResolvedValue(undefined);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await controller.desativarRegistro(req, res);

      expect(serviceInstance.desativarRegistro).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Registro desativado com sucesso!" });
    });

    it("deve retornar 400 se o service lancar erro", async () => {
      const erro = new Error("Falha ao desativar");
      serviceInstance.desativarRegistro.mockRejectedValue(erro);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await controller.desativarRegistro(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro });
    });
  });
});
