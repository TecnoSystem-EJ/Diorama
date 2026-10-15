import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const serviceInstance = {
  buscar: jest.fn(),
};

await jest.unstable_mockModule("../../services/usuarioService.js", () => ({
  UsuarioService: jest.fn(() => serviceInstance),
}));

await jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

const bcryptMod = await import("bcrypt");
const jwtMod = await import("jsonwebtoken");
const bcrypt = (bcryptMod as any).default;
const jwt = (jwtMod as any).default;
const { AuthController } = await import("../../controllers/authController.js");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;
}

function mockReq(body: any = {}) {
  return { body } as any;
}

describe("AuthController", () => {
  const controller = new AuthController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("deve retornar 400 se o email ou senha nao forem fornecidos", async () => {
      const req = mockReq({ email: "" });
      const res = mockRes();

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Email ou senha não fornecidos.",
      });
    });

    it("deve retornar 400 se somente a senha nao for fornecida", async () => {
      const req = mockReq({ email: "t@t.com" });
      const res = mockRes();

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("deve retornar 400 se o usuario nao for encontrado", async () => {
      serviceInstance.buscar.mockResolvedValue(null);

      const req = mockReq({ email: "t@t.com", senha: "123" });
      const res = mockRes();

      await controller.login(req, res);

      expect(serviceInstance.buscar).toHaveBeenCalledWith("t@t.com");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Usuário ou senha incorretos." });
    });

    it("deve retornar 400 se a senha for invalida", async () => {
      serviceInstance.buscar.mockResolvedValue({
        id: 1,
        email: "t@t.com",
        senhaHash: "hash",
        role: "ADMIN",
      });
      bcrypt.compare.mockResolvedValue(false);

      const req = mockReq({ email: "t@t.com", senha: "123" });
      const res = mockRes();

      await controller.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("123", "hash");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Usuário ou senha incorretos." });
    });

    it("deve retornar o token JWT quando as credenciais forem validas", async () => {
      serviceInstance.buscar.mockResolvedValue({
        id: 1,
        email: "t@t.com",
        senhaHash: "hash",
        role: "ADMIN",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token-jwt");

      const req = mockReq({ email: "t@t.com", senha: "123" });
      const res = mockRes();

      await controller.login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: "ADMIN" }, "test-secret", {
        expiresIn: "7d",
      });
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Login realizado com sucesso!!",
        token: "token-jwt",
      });
    });

    it("deve retornar 400 se ocorrer um erro inesperado", async () => {
      const erro = new Error("Falha no banco");
      serviceInstance.buscar.mockRejectedValue(erro);

      const req = mockReq({ email: "t@t.com", senha: "123" });
      const res = mockRes();

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro });
    });
  });
});
