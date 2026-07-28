import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const serviceInstance = {
  listar: jest.fn(),
  buscar: jest.fn(),
  cadastrar: jest.fn(),
  editar: jest.fn(),
  desativarRegistro: jest.fn(),
  deletar: jest.fn(),
};

await jest.unstable_mockModule("../../services/usuarioService.js", () => ({
  UsuarioService: jest.fn(() => serviceInstance),
}));

const { UsuarioController } = await import("../../controllers/usuarioController.js");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;
}

function mockReq(body: any = {}, params: any = {}) {
  return { body, params } as any;
}

describe("UsuarioController", () => {
  const controller = new UsuarioController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listar", () => {
    it("deve retornar a lista de usuarios com a quantidade", async () => {
      const usuarios = [{ id: 1 }, { id: 2 }];
      serviceInstance.listar.mockResolvedValue(usuarios);

      const req = mockReq();
      const res = mockRes();

      await controller.listar(req, res);

      expect(res.json).toHaveBeenCalledWith({ quantidade: 2, usuarios });
    });

    it("deve retornar quantidade 0 quando nao houver usuarios", async () => {
      serviceInstance.listar.mockResolvedValue([]);

      const req = mockReq();
      const res = mockRes();

      await controller.listar(req, res);

      expect(res.json).toHaveBeenCalledWith({ quantidade: 0, usuarios: [] });
    });
  });

  describe("buscarPorEmail", () => {
    it("deve retornar 400 se o email nao for fornecido", async () => {
      const req = mockReq({}, { email: "" });
      const res = mockRes();

      await controller.buscarPorEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "O email não foi fornecido." });
    });

    it("deve retornar 404 se o usuario nao for encontrado", async () => {
      serviceInstance.buscar.mockResolvedValue(null);

      const req = mockReq({}, { email: "naoexiste@teste.com" });
      const res = mockRes();

      await controller.buscarPorEmail(req, res);

      expect(serviceInstance.buscar).toHaveBeenCalledWith("naoexiste@teste.com");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "usuario não encontrado." });
    });

    it("deve retornar o usuario encontrado", async () => {
      const usuario = { id: 1, email: "teste@teste.com" };
      serviceInstance.buscar.mockResolvedValue(usuario);

      const req = mockReq({}, { email: "teste@teste.com" });
      const res = mockRes();

      await controller.buscarPorEmail(req, res);

      expect(res.json).toHaveBeenCalledWith({ usuario });
    });
  });

  describe("criar", () => {
    it("deve retornar 400 se os parametros forem insuficientes (sem username)", async () => {
      const req = mockReq({ email: "t@t.com", senha: "123", role: "admin" });
      const res = mockRes();

      await controller.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Parâmetros insuficientes." });
    });

    it("deve retornar 400 se a role for invalida", async () => {
      const req = mockReq({
        username: "user",
        email: "t@t.com",
        senha: "123",
        role: "invalida",
      });
      const res = mockRes();

      await controller.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Tipo de usuário inexistente." });
    });

    it("deve criar um usuario admin com sucesso (201)", async () => {
      const usuarioCriado = { id: 1, username: "user" };
      serviceInstance.cadastrar.mockResolvedValue(usuarioCriado);

      const req = mockReq({
        username: "user",
        email: "t@t.com",
        senha: "123",
        role: "admin",
      });
      const res = mockRes();

      await controller.criar(req, res);

      expect(serviceInstance.cadastrar).toHaveBeenCalledWith({
        email: "t@t.com",
        username: "user",
        senha: "123",
        role: "ADMIN",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Usuário Cadastrado com sucesso!",
        usuario: usuarioCriado,
      });
    });

    it("deve criar um usuario autor com sucesso (201)", async () => {
      const usuarioCriado = { id: 2, username: "autor" };
      serviceInstance.cadastrar.mockResolvedValue(usuarioCriado);

      const req = mockReq({
        username: "autor",
        email: "autor@t.com",
        senha: "123",
        role: "autor",
      });
      const res = mockRes();

      await controller.criar(req, res);

      expect(serviceInstance.cadastrar).toHaveBeenCalledWith({
        email: "autor@t.com",
        username: "autor",
        senha: "123",
        role: "AUTOR",
      });
    });

    it("deve retornar 400 se o service lancar erro ao criar", async () => {
      const erro = new Error("Email ja existe");
      serviceInstance.cadastrar.mockRejectedValue(erro);

      const req = mockReq({
        username: "user",
        email: "t@t.com",
        senha: "123",
        role: "admin",
      });
      const res = mockRes();

      await controller.criar(req, res);

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

    it("deve retornar 400 se o id for invalido (nao numerico)", async () => {
      const req = mockReq({}, { id: "abc" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Usuário inválido." });
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

    it("deve editar o username com sucesso", async () => {
      const usuarioEditado = { id: 1, username: "novo" };
      serviceInstance.editar.mockResolvedValue(usuarioEditado);

      const req = mockReq({ username: "novo" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith(1, { username: "novo" });
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Usuário editado com sucesso!",
        usuario: usuarioEditado,
      });
    });

    it("deve editar a role para admin com sucesso", async () => {
      const usuarioEditado = { id: 1 };
      serviceInstance.editar.mockResolvedValue(usuarioEditado);

      const req = mockReq({ role: "admin" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith(1, { role: "ADMIN" });
    });

    it("deve editar a role para autor com sucesso", async () => {
      const usuarioEditado = { id: 1 };
      serviceInstance.editar.mockResolvedValue(usuarioEditado);

      const req = mockReq({ role: "autor" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(serviceInstance.editar).toHaveBeenCalledWith(1, { role: "AUTOR" });
    });

    it("deve retornar 400 se a role for invalida ao editar", async () => {
      const req = mockReq({ role: "invalida" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Tipo de usuário inexistente." });
    });

    it("deve retornar 400 se o service lancar erro ao editar", async () => {
      const erro = new Error("Falha ao editar");
      serviceInstance.editar.mockRejectedValue(erro);

      const req = mockReq({ username: "novo" }, { id: "1" });
      const res = mockRes();

      await controller.editar(req, res);

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

    it("deve retornar 400 se o id for invalido (nao numerico)", async () => {
      const req = mockReq({}, { id: "abc" });
      const res = mockRes();

      await controller.desativarRegistro(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Usuário inválido." });
    });

    it("deve desativar o registro com sucesso", async () => {
      serviceInstance.desativarRegistro.mockResolvedValue(undefined);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await controller.desativarRegistro(req, res);

      expect(serviceInstance.desativarRegistro).toHaveBeenCalledWith(1);
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
