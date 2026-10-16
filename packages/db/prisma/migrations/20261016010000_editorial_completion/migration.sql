ALTER TABLE "edicoes" ADD COLUMN "pdf_url" TEXT;

CREATE TYPE "NewsletterCampaignStatus" AS ENUM ('RASCUNHO', 'ENVIANDO', 'CONCLUIDA', 'PARCIAL');
CREATE TYPE "NewsletterDeliveryStatus" AS ENUM ('PENDENTE', 'ENVIANDO', 'ENVIADA', 'FALHOU', 'INCERTA', 'CANCELADA');

CREATE TABLE "newsletter_campanhas" (
  "id" TEXT NOT NULL,
  "assunto" TEXT NOT NULL,
  "conteudo_html" TEXT NOT NULL,
  "status" "NewsletterCampaignStatus" NOT NULL DEFAULT 'RASCUNHO',
  "publico_fixado_em" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "newsletter_campanhas_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "newsletter_entregas" (
  "id" TEXT NOT NULL,
  "campanha_id" TEXT NOT NULL,
  "subscriber_id" INTEGER NOT NULL,
  "status" "NewsletterDeliveryStatus" NOT NULL DEFAULT 'PENDENTE',
  "tentativas" INTEGER NOT NULL DEFAULT 0,
  "enviado_em" TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "newsletter_entregas_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "newsletter_entregas_campanha_id_subscriber_id_key" ON "newsletter_entregas"("campanha_id", "subscriber_id");
CREATE INDEX "newsletter_entregas_campanha_id_status_idx" ON "newsletter_entregas"("campanha_id", "status");
ALTER TABLE "newsletter_entregas" ADD CONSTRAINT "newsletter_entregas_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "newsletter_campanhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "newsletter_entregas" ADD CONSTRAINT "newsletter_entregas_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
