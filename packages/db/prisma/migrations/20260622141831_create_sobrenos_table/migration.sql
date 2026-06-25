-- CreateTable
CREATE TABLE "sobre_nos" (
    "id" SERIAL NOT NULL,
    "texto_completo_html" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sobre_nos_pkey" PRIMARY KEY ("id")
);
