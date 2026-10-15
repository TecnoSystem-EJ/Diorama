import { jest, describe, it, expect, beforeEach, type Mock } from "@jest/globals";

const jwtMock = {
  sign: jest.fn(),
  verify: jest.fn(),
};

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: jwtMock,
}));

await import("jsonwebtoken");
const { authMiddleware } = await import("../../middlewares/authMilddleware.js");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;
}

function mockReq(headers: any = {}) {
  return { headers } as any;
}

describe("authMiddleware", () => {
  const next = jest.fn() as unknown as Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 401 se o header authorization nao for enviado", () => {
    const req = mockReq();
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token não enviado." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o token estiver ausente (so o prefixo Bearer)", () => {
    const req = mockReq({ authorization: "Bearer " });
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token não enviado." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o jwt.verify lancar erro (token invalido)", () => {
    jwtMock.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = mockReq({ authorization: "Bearer token-invalido" });
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o decoded for uma string", () => {
    jwtMock.verify.mockReturnValue("decoded-string");

    const req = mockReq({ authorization: "Bearer token-valido" });
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o decoded nao tiver o campo id", () => {
    jwtMock.verify.mockReturnValue({ role: "ADMIN" });

    const req = mockReq({ authorization: "Bearer token-valido" });
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o decoded nao tiver o campo role", () => {
    jwtMock.verify.mockReturnValue({ id: 1 });

    const req = mockReq({ authorization: "Bearer token-valido" });
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido." });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next() e atribuir req.user quando o token for valido", () => {
    const decoded = { id: "1", role: "ADMIN" };
    jwtMock.verify.mockReturnValue(decoded);

    const req = mockReq({ authorization: "Bearer token-valido" }) as any;
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(jwtMock.verify).toHaveBeenCalledWith("token-valido", "test-secret");
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
