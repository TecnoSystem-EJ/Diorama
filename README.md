# Diorama

Plataforma editorial com site público, painel administrativo e API conectada ao PostgreSQL. A estrutura e a apresentação originais do projeto são preservadas; as funcionalidades são acrescentadas nos componentes existentes.

## Estrutura

- `apps/web`: Next.js 16, React 19, Tailwind e editor Tiptap.
- `apps/backend`: Express, JWT, bcrypt, uploads e rotas editoriais.
- `packages/db`: Prisma 7, cliente PostgreSQL e migrações.
- `packages/ui`: componentes compartilhados.

## Desenvolvimento local

Requer Node.js 22.12 ou superior, pnpm 9 e Docker com Compose.

1. Configure os arquivos de ambiente:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

   Preencha `JWT_SECRET` em `apps/backend/.env` com um segredo aleatório:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   A API e as migrações usam primeiro `apps/backend/.env`. O arquivo `packages/db/.env` é apenas uma alternativa. Variáveis já exportadas no terminal têm precedência. As credenciais do Compose são destinadas ao ambiente local.

2. Instale as dependências e prepare o banco:

   ```bash
   pnpm install --frozen-lockfile
   docker compose up -d --wait postgres
   pnpm --filter @diorama/db db:migrate
   pnpm --filter backend admin:create
   ```

   O último comando cria `ADMIN_EMAIL` (padrão: `admin@diorama.local`). Ele usa `ADMIN_PASSWORD` quando configurada ou mostra uma senha aleatória uma única vez. Se o usuário já existe, preserva sua senha e suas permissões. Não existe cadastro público de administradores.

3. Inicie as aplicações:

   ```bash
   pnpm dev
   ```

   - Site: <http://localhost:3000>
   - Login: <http://localhost:3000/login>
   - Painel: <http://localhost:3000/pages/dashboard>
   - API: <http://localhost:3001/api/v1>
   - Saúde da API e banco: <http://localhost:3001/health>

   `NEXT_PUBLIC_API_BASE_URL` é o endereço acessível pelo navegador. `API_INTERNAL_URL` é usado pelo Next.js para buscar conteúdo no servidor. `PUBLIC_API_URL` define as URLs dos arquivos publicados. Se mudar as portas ou o domínio, ajuste também `WEB_ORIGIN` e reinicie as aplicações.

## Fluxos conectados

- Login, sessão validada na API e logout.
- Edições: criar com capa e PDF da edição completa opcional, pesquisar, listar, editar título/tag/arquivos e remover.
- Matérias: criar com autoria, imagem, conteúdo e PDF obrigatório; editar sem reenviar arquivos; mover entre edições; pesquisar, ler e remover.
- Blog e projetos: criar, editar, listar e remover no painel; ler nas páginas públicas. O blog mostra o conteúdo na listagem, e os projetos exibem uma descrição nos cards.
- Sobre: editar, salvar e carregar o texto no site público.
- Newsletter: inscrição pela home, página `/newsletter` e rodapé; campanhas com rascunho, revisão e confirmação pelo administrador; envio SMTP individual e cancelamento por link. Entregas confirmadas não são reenviadas; entregas incertas exigem revisão no provedor.

Operações de escrita editorial e gerenciamento de usuários exigem um administrador ativo. O HTML é sanitizado no servidor. Registros removidos deixam de aparecer nas páginas e consultas públicas.

Uploads usam `multipart/form-data`: `capa` e `edicaoPdf` opcional para edições; `imagemDestaque` e `revistaPdf` obrigatório no cadastro de matérias. O PDF existente é preservado ao editar sem anexar um novo arquivo. Cada arquivo pode ter até 20 MB. Imagens aceitas: JPEG, PNG, WebP e GIF. Arquivos são gravados em `apps/backend/static`, fora do Git, e devem ter armazenamento persistente na implantação.

O backup é opcional (`ENABLE_BACKUP=true`), usa `DATABASE_URL` e inclui banco, uploads e manifesto de checksums. No host sem cliente PostgreSQL instalado, use `BACKUP_USE_DOCKER=true`. Os comandos `pnpm --filter backend backup` e `pnpm --filter backend backup:verify CAMINHO` geram o backup e testam sua restauração em um banco temporário. Consulte [implantação e recuperação](deploy/README.md).

## Verificações

```bash
pnpm check-types
pnpm lint
pnpm test
pnpm build
```

Os testes unitários do backend usam Jest e mocks. O build do backend verifica os tipos; sua execução usa `tsx`. O Next.js gera a compilação de produção normalmente.

Para testar os fluxos reais, mantenha o banco e `pnpm dev` ativos, configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env` com as credenciais de um administrador existente e execute:

```bash
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

Os seis testes Playwright cobrem permissões da API, senha e usuário desativado, login, sessão após recarregar, uploads, PDF obrigatório, criação e edição de matérias/blog/projetos, troca de edição e autoria, preservação de arquivos, vídeos, publicação, busca e filtros, navegação da home original, leitor de PDF, remoção, sobre, logout e newsletter. Também verificam as seis abas do painel em 390, 768 e 1440 px e os cinco formulários no celular, com foco por teclado e Escape. Criam registros identificados como testes e desativam o conteúdo editorial criado. Execute em um banco de desenvolvimento. As inscrições e campanhas de teste permanecem no banco. Por padrão a suíte não dispara campanhas; para exercitar SMTP, habilite somente o capturador local conforme abaixo.

Variáveis opcionais para os testes: `E2E_WEB_URL`, `E2E_API_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`. `E2E_BROWSER_WS_URL` permite usar um servidor Playwright externo, da mesma versão instalada, sem montar o repositório no contêiner. Traces e screenshots de falhas ficam em `test-results/`, fora do Git.

## Newsletter em desenvolvimento

O provedor e o remetente de produção ainda não foram definidos. Para testar sem enviar mensagens externas:

```bash
docker compose --profile mail up -d mailpit
```

No `apps/backend/.env`, configure `SMTP_HOST=127.0.0.1`, `SMTP_PORT=1025`, `SMTP_SECURE=false`, `NEWSLETTER_FROM=Diorama <newsletter@diorama.local>` e `NEWSLETTER_PUBLIC_URL=http://localhost:3000`, e reinicie a API. As mensagens serão capturadas em <http://localhost:8025>. Na aba Newsletter do painel, crie um rascunho, revise e confirme o envio. Cancelamentos são respeitados a cada entrega.

Com o Mailpit local e as aplicações ativos, `E2E_SMTP_TESTS=1 pnpm test:e2e` também verifica envio, cancelamento e ausência de duplicação. Não use essa opção com SMTP real. Na publicação, configure o provedor escolhido; sem configuração SMTP, a aplicação informa a indisponibilidade e preserva os rascunhos.

## Publicação e dados oficiais

Os arquivos [deploy/compose.yml](deploy/compose.yml), [Dockerfile](Dockerfile) e [deploy/README.md](deploy/README.md) preparam frontend, API, PostgreSQL, HTTPS via Caddy, uploads e backups persistentes. Nenhuma publicação externa foi realizada: domínio, hospedagem e provedor de e-mail aguardam definição da equipe.

As variáveis públicas em `apps/web/.env.example` configuram domínio, contato, redes sociais e ISSN. Sem esses dados, o site oculta links e identificações oficiais e exibe textos institucionais neutros. Sem `NEXT_PUBLIC_SITE_URL`, a indexação é desabilitada; ao configurar o domínio, sitemap, robots e metadados passam a usar a origem informada.

## TODO — acompanhamento das entregas

Referência funcional: [protótipo editorial](docs/diorama_editorial.html). Por orientação do usuário, manter a estrutura já existente no projeto, incluindo home, cabeçalho, menu, rodapé, páginas institucionais e componentes do painel. O protótipo não autoriza substituir esses layouts. As pendências que dependem de dados oficiais ou serviços externos estão reunidas ao final. Veja o [registro das verificações](docs/validacao-local.md).

### Decisões a alinhar com a equipe

- [x] PDF de cada matéria obrigatório, conforme decisão do usuário. Edições de conteúdo preservam o PDF existente quando não há substituição.
- [x] Edição completa com PDF próprio opcional e leitor no site. Quando não há PDF completo, o índice continua oferecendo matérias e PDFs individuais.
- [x] Blog com conteúdo na listagem, preservando páginas individuais para cada ensaio.
- [x] Projetos com descrição nos cards e acesso à página individual.
- [x] Vídeos incorporados de YouTube e Vimeo, com URLs validadas no editor e sanitização no servidor.

### P1 — completar os fluxos editoriais

- [x] Conectar o formulário de newsletter do rodapé à rota `/subscribers`, usando o mesmo fluxo da home. Remover a chamada ao Web3Forms sem chave configurada.
- [x] Adicionar edição de matérias no painel, carregando os dados existentes e permitindo salvar alterações.
- [x] Completar a atualização de matérias na API para alterar autoria e edição vinculada, além de título, conteúdo e arquivos. Permitir mover uma matéria entre edições.
- [x] Adicionar endpoint e formulário de edição de ensaios do blog.
- [x] Adicionar endpoint e formulário de edição de projetos.
- [x] Permitir editar matérias sem reenviar imagem e PDF quando os arquivos existentes forem mantidos.
- [x] Permitir número/tag de edição em texto livre, preservando valores como `Edição 01` e identificações especiais, sem conversão obrigatória para número.

### P2 — completar funcionalidades preservando a estrutura existente

- [x] Preservar a home original com fundo, efeito de movimento, menu de edições e newsletter. Os blocos adicionais de destaques foram retirados para manter a estrutura solicitada.
- [x] Adicionar pesquisa de edições por título e número/tag, incluindo mensagem quando não houver resultados.
- [x] Adicionar filtro de matérias dentro da edição por título, autor e conteúdo.
- [x] Implementar resultados para a busca geral do cabeçalho.
- [x] Implementar a leitura da edição completa conforme a decisão da equipe, incluindo armazenamento e API quando houver PDF próprio, e conectar os botões do índice e da página da matéria.
- [x] Implementar vídeos incorporados no editor e na leitura pública, caso aprovados, com sanitização compatível com os provedores permitidos.
- [x] Manter home, cabeçalho, navegação, cores, tipografia e espaçamentos da implementação original, com ajustes pontuais para funcionamento e celular.
- [x] Preservar os cards de edições, o índice em lista e a apresentação original de blog e projetos, integrando pesquisa, conteúdo e PDFs nesses layouts.
- [x] Manter as interações existentes e respeitar a preferência por movimento reduzido, sem introduzir outro sistema visual.
- [x] Exibir acesso a login ou painel na navegação conforme o estado da sessão.
- [x] Conectar os itens de menu e botões de redes sociais aos destinos reais; remover ou sinalizar itens sem funcionalidade disponível.
- [x] Remover `Lorem ipsum` e identificações fictícias das páginas institucionais, preservar o menu lateral e os blocos existentes e permitir configurar contato, redes e ISSN sem inventar dados oficiais.

### P3 — preparar a publicação

Estes itens complementam o protótipo para operar o site publicado.

- [x] Implementar envio SMTP de newsletters, rascunho, revisão, confirmação e controle de entregas; validar com Mailpit local.
- [x] Implementar cancelamento de inscrição e garantir que assinantes cancelados não recebam novos envios.
- [x] Preparar imagens Docker e Compose para frontend, API e PostgreSQL, proxy HTTPS, variáveis de ambiente, migrações e instruções de implantação.
- [x] Configurar volumes persistentes para uploads e validar a preservação de arquivos ao recriar contêineres; conferir capa e PDF pela API de produção local.
- [x] Implementar backup agendado e manual com banco, uploads e checksums; testar restauração em banco temporário e recuperação dos arquivos publicados.
- [x] Adicionar títulos, descrições, metadados de compartilhamento, sitemap e robots para as páginas públicas.

### Validação de cada entrega

- [x] Ampliar os testes de integração para edição de matérias, blog e projetos, incluindo troca da edição vinculada e preservação de arquivos existentes.
- [x] Testar a newsletter do rodapé, o cancelamento de inscrição, o envio SMTP local e a ausência de duplicação.
- [x] Testar buscas, filtros, navegação da home original e leitura da edição completa.
- [x] Revisar páginas públicas e as seis abas do painel em celular, tablet e desktop; conferir tabelas, formulários, editor, menus e visualizador de PDF.
- [x] Revisar navegação por teclado, foco, fechamento de modais, nomes acessíveis e mensagens de erro e sucesso.
- [x] Conferir as funcionalidades usando os registros dos testes, páginas vazias, carregamento de formulários e mensagens de falha; preservar a apresentação anterior do projeto.
- [x] Executar `pnpm check-types`, `pnpm lint`, `pnpm test`, `pnpm build` e Playwright após as alterações: 130 testes unitários e seis testes completos aprovados, incluindo SMTP local.
- [x] Adicionar CI para repetir tipos, lint, testes, build e fluxos completos com PostgreSQL e Mailpit descartáveis. A execução no GitHub ocorrerá após enviar as alterações.

### Pendências externas — aguardando definição da equipe

- [ ] Definir domínio e hospedagem; publicar com DNS, HTTPS e variáveis reais usando os arquivos de `deploy/`.
- [ ] Escolher provedor de e-mail e remetente, autorizar o domínio no provedor e validar entregas reais e cancelamento no ambiente publicado.
- [ ] Fornecer e aprovar textos institucionais finais, composição da equipe, contatos, redes sociais, pontos de distribuição e ISSN, quando aplicável.
- [ ] Definir retenção e destino externo dos backups; configurar a rotina no servidor escolhido e repetir a restauração nesse ambiente.
- [ ] Homologar login, publicação e edição, uploads após atualização, PDFs, buscas, newsletter e metadados no domínio definitivo.
