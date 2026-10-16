# Publicação

A publicação externa depende de domínio, servidor, remetente de e-mail e dados institucionais ainda não definidos pela equipe. Os arquivos deste diretório preparam a instalação em um servidor com Docker Compose. Nenhum domínio ou conta externa é criado automaticamente.

## Preparação

1. Aponte o DNS do domínio para o servidor e libere as portas 80 e 443.
2. Copie `deploy/.env.example` para `deploy/.env` e preencha as variáveis. `SITE_HOST` recebe o domínio sem protocolo, e `SITE_URL` a URL completa com HTTPS. Gere `POSTGRES_PASSWORD` e `JWT_SECRET` com `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`, usando um valor diferente para cada variável.
3. Configure o SMTP do provedor escolhido. O remetente deve estar autorizado no provedor. Sem SMTP a aplicação continua disponível, mas não envia campanhas.
4. Gere as imagens, inicie o banco e aplique as migrações antes de iniciar a aplicação:

   ```bash
   docker compose --env-file deploy/.env -f deploy/compose.yml build
   docker compose --env-file deploy/.env -f deploy/compose.yml up -d --wait postgres
   docker compose --env-file deploy/.env -f deploy/compose.yml --profile tools run --rm migrate
   docker compose --env-file deploy/.env -f deploy/compose.yml up -d
   ```

5. Crie o administrador pelo comando `admin:create` no contêiner backend. Defina `ADMIN_EMAIL` e `ADMIN_PASSWORD` pelo ambiente de execução; não salve a senha em arquivos versionados ou no histórico do terminal. Se a senha não for informada, o comando gera e exibe uma senha inicial.
6. Valide `/api/health`, login, cadastros, edição, cancelamento de newsletter e leitura dos PDFs no domínio escolhido.

O Caddy obtém e renova o certificado HTTPS. O PostgreSQL fica na rede interna dos contêineres; somente o proxy publica portas. Alterações nas variáveis públicas exigem reconstruir a imagem web. `.dockerignore` impede que arquivos `.env`, credenciais, uploads e backups locais entrem nas imagens.

## Persistência e backup

Os volumes `database`, `uploads` e `backups` preservam os dados após recriar os contêineres. Não use `docker compose down -v` em um ambiente com dados a preservar.

Com `ENABLE_BACKUP=true`, a API gera diariamente às 02h de São Paulo um dump PostgreSQL, um arquivo dos uploads e um manifesto com checksums. `BACKUP_SCHEDULE` permite alterar o horário. A rotina usa o cliente PostgreSQL da imagem, sem acesso ao socket Docker. Para executar e verificar manualmente:

```bash
docker compose --env-file deploy/.env -f deploy/compose.yml exec backend pnpm --filter backend backup
# Substitua o caminho pelo diretório retornado pelo comando anterior:
docker compose --env-file deploy/.env -f deploy/compose.yml exec backend pnpm --filter backend backup:verify /data/backups/diorama-DATA-ID
```

`backup:verify` verifica os checksums, restaura o dump em um banco temporário, consulta as tabelas recuperadas e extrai os uploads em um diretório temporário para verificar seus hashes. Ao terminar, remove apenas esses recursos temporários. O banco da aplicação é preservado.

Copie backups concluídos para um armazenamento externo ao servidor com política de retenção definida pela equipe. O volume local não protege contra perda do servidor.

Em uma recuperação real, mantenha o site em manutenção, valide o backup primeiro e restaure o dump em um banco novo. Recupere `uploads.tar.gz` em um volume novo, confira os checksums e então aponte `DATABASE_URL` e o volume de uploads da aplicação para os recursos restaurados. Preserve o banco e os arquivos anteriores até concluir a validação no site.

## Desenvolvimento e teste de restauração

Com o PostgreSQL local ativo, `BACKUP_USE_DOCKER=true pnpm --filter backend backup` executa o dump no contêiner do banco e arquiva `apps/backend/static`. Use a mesma variável com `backup:verify CAMINHO` para testar a recuperação sem instalar o cliente PostgreSQL no host. Não execute testes de restauração contra serviços de produção sem uma janela de manutenção definida.
