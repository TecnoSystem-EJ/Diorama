import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};

await jest.unstable_mockModule("bcrypt", () => ({
  default: bcryptMock,
}));

const { db, Prisma, UsuarioRole } = await import("@diorama/db");
const { UsuarioService } = await import("../../services/usuarioService.js");

const mockedDb = db as any;
const bcrypt = bcryptMock;

describe("UsuarioService", () => {
  let service: InstanceType<typeof UsuarioService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsuarioService();
  });

  describe("listar", () => {
    it("deve chamar db.usuario.findMany com where deleted:false", async () => {
      const usuarios = [{ id: 1 }];
      mockedDb.usuario.findMany.mockResolvedValue(usuarios);

      const result = await service.listar();

      expect(mockedDb.usuario.findMany).toHaveBeenCalledWith({ where: { deleted: false } });
      expect(result).toEqual(usuarios);
    });
  });

  describe("buscar", () => {
    it("deve chamar db.usuario.findUnique com o email fornecido", async () => {
      const usuario = { id: 1, email: "t@t.com" };
      mockedDb.usuario.findUnique.mockResolvedValue(usuario);

      const result = await service.buscar("t@t.com");

      expect(mockedDb.usuario.findUnique).toHaveBeenCalledWith({ where: { email: "t@t.com" } });
      expect(result).toEqual(usuario);
    });

    it("deve retornar null quando o usuario nao for encontrado", async () => {
      mockedDb.usuario.findUnique.mockResolvedValue(null);

      const result = await service.buscar("naoexiste@t.com");

      expect(result).toBeNull();
    });
  });

  describe("cadastrar", () => {
    it("deve fazer o hash da senha e chamar db.usuario.create", async () => {
      bcrypt.hash.mockResolvedValue("hashed-password" as never);
      const usuarioCriado = { id: 1, username: "user", email: "t@t.com" };
      mockedDb.usuario.create.mockResolvedValue(usuarioCriado);

      const result = await service.cadastrar({
        username: "user",
        email: "t@t.com",
        senha: "123456",
        role: UsuarioRole.ADMIN,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(mockedDb.usuario.create).toHaveBeenCalledWith({
        data: {
          username: "user",
          email: "t@t.com",
          senhaHash: "hashed-password",
          role: UsuarioRole.ADMIN,
        },
      });
      expect(result).toEqual(usuarioCriado);
    });
  });

  describe("desativarRegistro", () => {
    it("deve chamar db.usuario.update com deleted:true e deletedAt", async () => {
      mockedDb.usuario.update.mockResolvedValue({ id: 1, deleted: true });

      await service.desativarRegistro(1);

      expect(mockedDb.usuario.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
    });
  });

  describe("deletar", () => {
    it("deve chamar db.usuario.delete com o id fornecido", async () => {
      mockedDb.usuario.delete.mockResolvedValue({ id: 1 });

      await service.deletar(1);

      expect(mockedDb.usuario.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("editar", () => {
    it("deve chamar db.usuario.update com o id e os dados fornecidos", async () => {
      const data: Prisma.UsuarioUpdateInput = { username: "novo" } as any;
      const usuarioEditado = { id: 1, username: "novo" };
      mockedDb.usuario.update.mockResolvedValue(usuarioEditado);

      const result = await service.editar(1, data);

      expect(mockedDb.usuario.update).toHaveBeenCalledWith({ where: { id: 1 }, data });
      expect(result).toEqual(usuarioEditado);
    });

    it("deve chamar db.usuario.update ao editar role", async () => {
      const data: Prisma.UsuarioUpdateInput = { role: UsuarioRole.AUTOR } as any;
      mockedDb.usuario.update.mockResolvedValue({ id: 1 });

      await service.editar(1, data);

      expect(mockedDb.usuario.update).toHaveBeenCalledWith({ where: { id: 1 }, data });
    });
  });
});
