import { jest } from "@jest/globals";
import { RevistaService } from "../../services/revistaService.js";
import { db, Prisma } from "@diorama/db";

const mockedDb = db as jest.Mocked<typeof db>;

describe("RevistaService", () => {
  let service: RevistaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RevistaService();
  });

  describe("listar", () => {
    it("deve chamar db.revista.findMany com where deleted:false", async () => {
      const revistas = [{ id: "1" }, { id: "2" }];
      mockedDb.revista.findMany.mockResolvedValue(revistas as any);

      const result = await service.listar();

      expect(mockedDb.revista.findMany).toHaveBeenCalledWith({ where: { deleted: false } });
      expect(result).toEqual(revistas);
    });
  });

  describe("buscar", () => {
    it("deve chamar db.revista.findUnique com o id fornecido", async () => {
      const revista = { id: "1", titulo: "Revista 1" };
      mockedDb.revista.findUnique.mockResolvedValue(revista as any);

      const result = await service.buscar("1");

      expect(mockedDb.revista.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(result).toEqual(revista);
    });

    it("deve retornar null quando a revista nao for encontrada", async () => {
      mockedDb.revista.findUnique.mockResolvedValue(null);

      const result = await service.buscar("999");

      expect(result).toBeNull();
    });
  });

  describe("cadastrar", () => {
    it("deve chamar db.revista.create com os dados fornecidos", async () => {
      const data = {
        edicaoId: "ed-1",
        titulo: "Titulo",
        conteudo_html: "<p>html</p>",
        imagemDestaque: "http://localhost/img.png",
        pdfUrl: "http://localhost/file.pdf",
      };
      const revistaCriada = { id: "1", ...data };
      mockedDb.revista.create.mockResolvedValue(revistaCriada as any);

      const result = await service.cadastrar(data);

      expect(mockedDb.revista.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(revistaCriada);
    });
  });

  describe("desativarRegistro", () => {
    it("deve chamar db.revista.update com deleted:true e deletedAt", async () => {
      const now = new Date();
      mockedDb.revista.update.mockResolvedValue({ id: "1", deleted: true } as any);

      const result = await service.desativarRegistro("1");

      expect(mockedDb.revista.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
      expect(result).toEqual({ id: "1", deleted: true });
      const callArg = mockedDb.revista.update.mock.calls[0][0];
      expect((callArg.data.deletedAt as Date)).toBeInstanceOf(Date);
      expect((callArg.data.deletedAt as Date).getTime()).toBeGreaterThan(0);
    });
  });

  describe("deletar", () => {
    it("deve chamar db.revista.delete com o id fornecido", async () => {
      mockedDb.revista.delete.mockResolvedValue({ id: "1" } as any);

      await service.deletar("1");

      expect(mockedDb.revista.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });
  });

  describe("editar", () => {
    it("deve chamar db.revista.update com o id e os dados fornecidos", async () => {
      const data: Prisma.RevistaUpdateInput = { titulo: "Novo Titulo" } as any;
      const revistaEditada = { id: "1", titulo: "Novo Titulo" };
      mockedDb.revista.update.mockResolvedValue(revistaEditada as any);

      const result = await service.editar("1", data);

      expect(mockedDb.revista.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
      expect(result).toEqual(revistaEditada);
    });
  });
});