import { jest } from "@jest/globals";

export enum UsuarioRole {
  ADMIN = "ADMIN",
  AUTOR = "AUTOR",
}

export enum SubscriptionStatus {
  ATIVO = "ATIVO",
  CANCELADO = "CANCELADO",
}

export const Prisma = {
  RevistaUpdateInput: {} as any,
  EdicaoUpdateInput: {} as any,
  UsuarioUpdateInput: {} as any,
};

export const db = {
  revista: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  edicao: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  usuario: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  blog: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  projeto: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  sobreNos: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
  newsletterCampanha: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  newsletterEntrega: { findMany: jest.fn(), count: jest.fn(), createMany: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  subscribers: {
    upsert: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export default db;
