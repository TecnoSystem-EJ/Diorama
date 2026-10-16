# Diorama

Plataforma editorial com site público, painel administrativo e API conectada ao PostgreSQL.

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
- Edições: criar com capa, listar, editar título/número/capa e remover.
- Matérias: criar vinculadas a uma edição com autoria, imagem, PDF e conteúdo; listar e remover.
- Blog e projetos: criar, listar e remover no painel; ler nas páginas públicas.
- Sobre: editar, salvar e carregar o texto no site público.
- Newsletter: cadastrar o e-mail no PostgreSQL pela home e pela página `/newsletter`. O formulário do rodapé e o envio de campanhas ainda estão pendentes.

Operações de escrita editorial e gerenciamento de usuários exigem um administrador ativo. O HTML é sanitizado no servidor. Registros removidos deixam de aparecer nas páginas e consultas públicas.

Uploads usam `multipart/form-data`: `capa` para edições; `imagemDestaque` e `revistaPdf` para matérias. Cada arquivo pode ter até 20 MB. Imagens aceitas: JPEG, PNG, WebP e GIF. Arquivos são gravados em `apps/backend/static`, fora do Git, e devem ter armazenamento persistente na implantação.

O backup via Docker é opcional (`ENABLE_BACKUP=true`) e requer as variáveis `DB_*` e `CONTAINER_NAME`. Não é iniciado por padrão no desenvolvimento.

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

Os testes Playwright cobrem permissões da API, senha e usuário desativado, login, sessão após recarregar, uploads, cadastros, edição de edição, publicação no site, remoção, sobre, logout e newsletter no celular. Criam registros identificados como testes e desativam o conteúdo editorial criado. Execute em um banco de desenvolvimento. A inscrição de teste permanece no banco e nenhum e-mail é enviado.

Variáveis opcionais para os testes: `E2E_WEB_URL`, `E2E_API_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`. `E2E_BROWSER_WS_URL` permite usar um servidor Playwright externo, da mesma versão instalada, sem montar o repositório no contêiner. Traces e screenshots de falhas ficam em `test-results/`, fora do Git.

## TODO — próximas entregas

Referência de produto e apresentação: [protótipo editorial](docs/diorama_editorial.html). As prioridades abaixo organizam as pendências identificadas na comparação com o projeto. Marque cada item após implementar e validar o fluxo completo com frontend, API e banco, quando aplicável.

### Decisões a alinhar com a equipe

- [ ] Definir se o PDF de cada matéria deve ser obrigatório ou opcional. O protótipo permite cadastrar texto com imagem; o projeto atual exige também um PDF.
- [ ] Definir como disponibilizar a edição completa: PDF próprio da edição ou navegação pelos documentos vinculados. O visualizador do protótipo é uma simulação e não carrega um PDF real.
- [ ] Definir se o blog deve mostrar o conteúdo dos ensaios na listagem, como no protótipo, ou manter a leitura em páginas individuais.
- [ ] Definir se os cards de projetos devem exibir a descrição, como no protótipo, além do acesso à página individual.
- [ ] Confirmar a incorporação de vídeos no editor e os provedores aceitos. Atualmente o botão insere apenas um link.

### P1 — completar os fluxos editoriais

- [ ] Conectar o formulário de newsletter do rodapé à rota `/subscribers`, usando o mesmo fluxo da home. Remover a chamada ao Web3Forms sem chave configurada.
- [ ] Adicionar edição de matérias no painel, carregando os dados existentes e permitindo salvar alterações.
- [ ] Completar a atualização de matérias na API para alterar autoria e edição vinculada, além de título, conteúdo e arquivos. Permitir mover uma matéria entre edições.
- [ ] Adicionar endpoint e formulário de edição de ensaios do blog.
- [ ] Adicionar endpoint e formulário de edição de projetos.
- [ ] Permitir editar matérias sem reenviar imagem e PDF quando os arquivos existentes forem mantidos.
- [ ] Permitir número/tag de edição em texto livre, preservando valores como `Edição 01` e identificações especiais, sem conversão obrigatória para número.

### P2 — completar a experiência do protótipo

- [ ] Exibir na home as quatro edições mais recentes, com capa, número/tag, título e acesso aos detalhes.
- [ ] Exibir na home as três matérias mais recentes, com imagem, edição, autoria, resumo e link de leitura.
- [ ] Adicionar pesquisa de edições por título e número/tag, incluindo mensagem quando não houver resultados.
- [ ] Adicionar filtro de matérias dentro da edição por título, autor e conteúdo.
- [ ] Implementar resultados para a busca geral do cabeçalho, que atualmente apenas abre o campo de pesquisa.
- [ ] Implementar a leitura da edição completa conforme a decisão da equipe, incluindo armazenamento e API quando houver PDF próprio, e conectar os botões do índice e da página da matéria.
- [ ] Implementar vídeos incorporados no editor e na leitura pública, caso aprovados, com sanitização compatível com os provedores permitidos.
- [ ] Ajustar home, cabeçalho, navegação, cores, tipografia e espaçamentos conforme a referência aprovada.
- [ ] Aproximar os cards de edições e matérias, o índice da edição e a apresentação de blog e projetos do protótipo.
- [ ] Reproduzir as animações de entrada e os efeitos de interação previstos, respeitando a preferência por movimento reduzido.
- [ ] Exibir acesso a login ou painel na navegação conforme o estado da sessão.
- [ ] Conectar os itens de menu e botões de redes sociais aos destinos reais; remover ou sinalizar itens sem funcionalidade disponível.
- [ ] Substituir os textos provisórios das páginas institucionais, incluindo os `Lorem ipsum` da equipe, e revisar contatos, pontos de distribuição e ISSN.

### P3 — preparar a publicação

Estes itens complementam o protótipo para operar o site publicado.

- [ ] Implementar o envio de newsletters com o serviço escolhido e configurar as credenciais no ambiente de publicação.
- [ ] Implementar cancelamento de inscrição e garantir que assinantes cancelados não recebam novos envios.
- [ ] Configurar hospedagem de frontend, API e PostgreSQL, com domínio, HTTPS e variáveis de ambiente correspondentes.
- [ ] Configurar armazenamento persistente dos uploads e validar o acesso às imagens e aos PDFs após reiniciar ou atualizar a aplicação.
- [ ] Configurar a rotina de backup para o ambiente escolhido e testar a restauração do banco e a recuperação dos arquivos publicados.
- [ ] Adicionar títulos, descrições, metadados de compartilhamento, sitemap e robots para as páginas públicas.

### Validação de cada entrega

- [ ] Ampliar os testes de integração para edição de matérias, blog e projetos, incluindo troca da edição vinculada e preservação de arquivos existentes.
- [ ] Testar a newsletter do rodapé, o cancelamento de inscrição e o envio pelo serviço escolhido.
- [ ] Testar buscas, filtros, destaques recentes e leitura da edição completa.
- [ ] Revisar todas as telas em celular, tablet e desktop, incluindo tabelas do painel, formulários, editor, menus e visualizador de PDF.
- [ ] Revisar navegação por teclado, foco, fechamento de modais, nomes acessíveis e mensagens de erro e sucesso.
- [ ] Conferir a apresentação com o protótipo usando conteúdo representativo e estados vazios, de carregamento e de falha.
- [ ] Executar `pnpm check-types`, `pnpm lint`, `pnpm test`, `pnpm build` e `pnpm test:e2e` após as alterações e validar os fluxos no ambiente de publicação.
