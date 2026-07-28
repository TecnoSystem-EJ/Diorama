import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const serviceInstance = {
  listar: jest.fn(),
  buscar: jest.fn(),
  cadastrar: jest.fn(),
  editar: jest.fn(),
  desativarRegistro: jest.fn(),
};

await jest.unstable_mockModule("../../services/edicaoService.js", () => ({
  EdicaoService: jest.fn(() => serviceInstance),
}));

await jest.unstable_mockModule("../../utils/fileUtils.js", () => ({
  fileUtils: { apagarArquivo: jest.fn() },
}));

const { fileUtils } = await import("../../utils/fileUtils.js");
const { EdicaoController } = await import("../../controllers/edicaoController.js");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;
}

function mockReq(body: any = {}, params: any = {}, file: any = undefined) {
  return {
    body,
    params,
    file,
    protocol: "http",
    get: jest.fn().mockReturnValue("localhost:3001"),
  } as any;
}

describe("EdicaoController", () => {
  const controller = new EdicaoController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listar", () => {
    it("deve retornar a lista de edicoes com a quantidade", async () => {
      const edicoes = [{ id: "1" }, { id: "2" }];
      serviceInstance.listar.mockResolvedValue(edicoes);

      const req = mockReq();
      const res = mockRes();

      await controller.listar(req, res);

      expect(res.json).toHaveBeenCalledWith({ quantidade: 2, edicoes });
    });

    it("deve retornar quantidade 0 quando nao houver edicoes", async () => {
      serviceInstance.listar.mockResolvedValue([]);

      const req = mockReq();
      const res = mockRes();

      await controller.listar(req, res);

      expect(res.json).toHaveBeenCalledWith({ quantidade: 0, edicoes: [] });
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

    it("deve retornar 404 se a edicao nao for encontrada", async () => {
      serviceInstance.buscar.mockResolvedValue(null);

      const req = mockReq({}, { id: "999" });
      const res = mockRes();

      await controller.buscarPorId(req, res);

      expect(serviceInstance.buscar).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Edição não encontrada." });
    });

    it("deve retornar a edicao encontrada", async () => {
      const edicao = { id: "1", titulo: "Edicao 1" };
      serviceInstance.buscar.mockResolvedValue(edicao);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await controller.buscarPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({ edicao });
    });
  });

  describe("criar", () => {
    it("deve retornar 400 se a capa nao for enviada", async () => {
      const req = mockReq({ titulo: "Titulo", numeroTag: "Tag 1" }, {}, undefined);
      const res = mockRes();

      await controller.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "É necessário enviar a imagem de capa." });
    });

    it("deve retornar 400 e apagar a capa se os parametros forem insuficientes", async () => {
      const req = mockReq(
        { titulo: "Titulo" },
        {},
        { path: "/tmp/capa.png", filename: "capa.png" }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/capa.png");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Parâmetros insuficientes." });
    });

    it("deve criar a edicao com sucesso (201) quando os dados forem validos", async () => {
      const edicaoCriada = { id: "1", titulo: "Titulo" };
      serviceInstance.cadastrar.mockResolvedValue(edicaoCriada);

      const req = mockReq(
        { titulo: "Titulo", numeroTag: "Tag 1" },
        {},
        { path: "/tmp/capa.png", filename: "capa.png" }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(serviceInstance.cadastrar).toHaveBeenCalledWith({
        numeroTag: "Tag 1",
        titulo: "Titulo",
        capaUrl: "http://localhost:3001/static/capas/capa.png",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Edição Cadastrada com sucesso!",
        edicao: edicaoCriada,
      });
    });

    it("deve retornar 400 e apagar a capa se o service lancar erro", async () => {
      const erro = new Error("Falha ao criar");
      serviceInstance.cadastrar.mockRejectedValue(erro);

      const req = mockReq(
        { titulo: "Titulo", numeroTag: "Tag 1" },
        {},
        { path: "/tmp/capa.png", filename: "capa.png" }
      );
      const res = mockRes();

      await controller.criar(req, res);

      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/capa.png");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro });
    });
  });

  describe("editar", () => {
    it("deve retornar 400 se o id nao for fornecido", async () => {
      const req = mockReq({}, { id: "" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "O id não foi fornecido." });
    });

    it("deve retornar 400 se nenhum dado for fornecido para alteracao", async () => {
      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Nenhum dado foi fornecido para alteração do regsitro.",
      });
    });

    it("deve editar a edicao com sucesso quando titulo for enviado", async () => {
      const edicaoEditada = { id: "1", titulo: "Novo Titulo" };
      serviceInstance.editar.mockResolvedValue(edicaoEditada);

      const req = mockReq({ titulo: "Novo Titulo" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith("1", { titulo: "Novo Titulo" });
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Edição editada com sucesso!",
        edicao: edicaoEditada,
      });
    });

    it("deve editar numeroTag quando enviado", async () => {
      const edicaoEditada = { id: "1" };
      serviceInstance.editar.mockResolvedValue(edicaoEditada);

      const req = mockReq({ numeroTag: "Nova Tag" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith("1", { numeroTag: "Nova Tag" });
    });

    it("deve retornar 400 se o service lancar erro ao editar", async () => {
      const erro = new Error("Falha ao editar");
      serviceInstance.editar.mockRejectedValue(erro);

      const req = mockReq({ titulo: "Novo", file: { path: "/tmp/capa.png" } }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(fileUtils.apagarArquivo).toHaveBeenCalledWith("/tmp/capa.png");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro });
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
