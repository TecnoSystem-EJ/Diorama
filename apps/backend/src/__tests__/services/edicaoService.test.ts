import { jest } from "@jest/globals";
import { EdicaoService } from "../../services/edicaoService.js";
import { db, Prisma } from "@diorama/db";

const mockedDb = db as jest.Mocked<typeof db>;

describe("EdicaoService", () => {
  let service: EdicaoService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EdicaoService();
  });

  describe("listar", () => {
    it("deve chamar db.edicao.findMany", async () => {
      const edicoes = [{ id: "1" }];
      mockedDb.edicao.findMany.mockResolvedValue(edicoes as any);

      const result = await service.listar();

      expect(mockedDb.edicao.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(edicoes);
    });
  });

  describe("buscar", () => {
    it("deve chamar db.edicao.findUnique com o id fornecido", async () => {
      const edicao = { id: "1", titulo: "Edicao 1" };
      mockedDb.edicao.findUnique.mockResolvedValue(edicao as any);

      const result = await service.buscar("1");

      expect(mockedDb.edicao.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(result).toEqual(edicao);
    });

    it("deve retornar null quando a edicao nao for encontrada", async () => {
      mockedDb.edicao.findUnique.mockResolvedValue(null);

      const result = await service.buscar("999");

      expect(result).toBeNull();
    });
  });

  describe("cadastrar", () => {
    it("deve chamar db.edicao.create com os dados fornecidos", async () => {
      const data = { numeroTag: "Tag 1", titulo: "Titulo", capaUrl: "http://localhost/capa.png" };
      const edicaoCriada = { id: "1", ...data };
      mockedDb.edicao.create.mockResolvedValue(edicaoCriada as any);

      const result = await service.cadastrar(data);

      expect(mockedDb.edicao.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(edicaoCriada);
    });
  });

  describe("desativarRegistro", () => {
    it("deve chamar db.edicao.update com deleted:true e deletedAt", async () => {
      mockedDb.edicao.update.mockResolvedValue({ id: "1", deleted: true } as any);

      await service.desativarRegistro("1");

      expect(mockedDb.edicao.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
    });
  });

  describe("deletar", () => {
    it("deve chamar db.edicao.delete com o id fornecido", async () => {
      mockedDb.edicao.delete.mockResolvedValue({ id: "1" } as any);

      await service.deletar("1");

      expect(mockedDb.edicao.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });
  });

  describe("editar", () => {
    it("deve chamar db.edicao.update com o id e os dados fornecidos", async () => {
      const data: Prisma.EdicaoUpdateInput = { titulo: "Novo" } as any;
      const edicaoEditada = { id: "1", titulo: "Novo" };
      mockedDb.edicao.update.mockResolvedValue(edicaoEditada as any);

      const result = await service.editar("1", data);

      expect(mockedDb.edicao.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
      expect(result).toEqual(edicaoEditada);
    });
  });
});