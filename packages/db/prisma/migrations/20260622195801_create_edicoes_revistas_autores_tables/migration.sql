/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `sobre_nos` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `sobre_nos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sobre_nos" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "edicoes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "numero_tag" TEXT NOT NULL,
    "capa_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "edicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revistas" (
    "id" TEXT NOT NULL,
    "edicao_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo_html" TEXT NOT NULL,
    "imagem_destaque" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "revistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autores" (
    "id" TEXT NOT NULL,
    "revista_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "edicoes_numero_tag_key" ON "edicoes"("numero_tag");

-- AddForeignKey
ALTER TABLE "revistas" ADD CONSTRAINT "revistas_edicao_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autores" ADD CONSTRAINT "autores_revista_id_fkey" FOREIGN KEY ("revista_id") REFERENCES "revistas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
