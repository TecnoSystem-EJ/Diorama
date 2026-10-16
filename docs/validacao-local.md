# Validação local — 16/10/2026

A estrutura original do site foi restaurada após a orientação do usuário: home com fundo e movimento, cabeçalho em duas faixas, menu verde, rodapé, páginas institucionais com menu lateral e organização dos componentes do painel. As funcionalidades foram mantidas nesses componentes. O protótipo `docs/diorama_editorial.html` serve como referência funcional. Os fluxos editoriais foram exercitados com frontend, API e PostgreSQL reais. Esta validação não equivale à homologação em uma hospedagem externa.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| `pnpm check-types` | Aprovado |
| `pnpm lint` | Aprovado, sem avisos |
| `pnpm test` | 13 suítes, 130 testes aprovados |
| `pnpm build` | Backend e frontend compilados |
| Playwright com SMTP local | Seis testes completos aprovados |
| Revisão adicional do painel | Seis abas em 390, 768 e 1440 px; cinco formulários no celular |
| Páginas públicas | 14 rotas em três larguras, sem rolagem horizontal da página |
| Docker | Imagens de frontend/backend compiladas; migrações aplicadas em banco descartável |
| Execução em contêineres | Login e uploads pela API; frontend recebeu conteúdo pela rede interna |
| Persistência | Registro, capa e PDF acessíveis após recriar o contêiner da API |
| Backup e restauração | Banco restaurado em banco temporário; 27 arquivos recuperados e conferidos por SHA-256 |

Os testes completos verificam autenticação e permissões, publicação e remoção, edição de edições/matérias/blog/projetos, autoria e troca da edição vinculada, preservação de arquivos, rejeição de matéria sem PDF, busca, filtros, navegação da home original, leitor de PDF e incorporação permitida de vídeo. Também verificam o conteúdo Sobre após recarregar, os formulários da newsletter, envio via Mailpit, cancelamento e ausência de duplicação de entregas confirmadas.

A revisão do painel verifica largura da página, foco inicial, manutenção do foco dentro dos modais, fechamento com Escape e retorno do foco ao botão de abertura. Foram revisados os estados vazios do acervo e de pesquisa, o carregamento dos formulários e mensagens de erro/sucesso. Uma resposta 503 simulada na inscrição da newsletter exibiu a mensagem de falha ao usuário.

Durante a validação foram corrigidos o editor Sobre sobrescrevendo conteúdo carregado, cliques antes da hidratação do cabeçalho e rótulos acessíveis das tabelas causando rolagem horizontal no celular.

## Repetir os testes

Siga a preparação local no [README](../README.md). Com PostgreSQL, Mailpit e as aplicações ativos:

```bash
pnpm check-types
pnpm lint
pnpm test
pnpm build
E2E_SMTP_TESTS=1 pnpm test:e2e
```

Use somente SMTP local capturado pelo Mailpit ao habilitar `E2E_SMTP_TESTS=1`. Os testes criam inscrições e campanhas identificadas como testes; o conteúdo editorial criado é desativado ao terminar. Use um banco de desenvolvimento.

Para conferir o backup local sem instalar o cliente PostgreSQL no host:

```bash
BACKUP_USE_DOCKER=true pnpm --filter backend backup
BACKUP_USE_DOCKER=true pnpm --filter backend backup:verify CAMINHO_DO_BACKUP
```

As imagens de produção foram executadas em um projeto Compose descartável, com volumes e banco separados do desenvolvimento. O frontend foi acessado pela porta local 3020 e a API pela 3021, sem publicar um domínio externo. Esses recursos de teste foram removidos após a verificação.

## Estrutura preservada

A home em `apps/web/app/home/page.tsx` foi restaurada integralmente da versão anterior às alterações. Foram removidos os componentes criados para substituir as páginas e o hook genérico que reorganizava os modais editoriais. A edição de matérias, blog e projetos permanece nos componentes de seção existentes. Os blocos novos de destaques da home foram retirados conforme a orientação de preservar a estrutura.

As verificações de imagens Docker, persistência e backup acima foram realizadas antes desta restauração visual; a revisão atual altera o frontend e preserva o backend e a infraestrutura validados.

## Ainda depende de definição externa

Domínio/hospedagem, provedor e remetente de e-mail, informações institucionais oficiais e política de retenção/destino externo dos backups. Após essas definições, repetir os fluxos no domínio definitivo, incluindo HTTPS, e-mail real, persistência após atualização e recuperação dos backups. A configuração da CI foi adicionada; sua execução no GitHub depende do envio das alterações ao repositório remoto.
