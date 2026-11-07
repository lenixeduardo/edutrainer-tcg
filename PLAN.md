# EduTrainer TCG — PLAN.md

## Escopo confirmado

Implementar o visual do mockup aprovado no **catálogo web** com carrinho e finalização por WhatsApp, mantendo painel administrativo existente. A documentação do projeto "Direct from Japan" é um trabalho separado e **não deve ser importada**.

## Fase 0 — Base e assets (executada neste pacote)

- [x] Identificar a referência aprovada de 07/11/2026.
- [x] Recuperar o MVP de Next.js com 11 cards Shiny já disponíveis.
- [x] Consolidar o design system white mode, azul e amarelo.
- [x] Criar marca vetorial própria (logo horizontal, marca, favicon).
- [x] Criar hero abstrato sem carta Pokémon gerada por IA e ilustração de estado vazio.
- [x] Preservar assets de cartas existentes; extrair recorte da foto física do Zapdos japonês fornecida.
- [x] Fornecer uma prévia HTML com busca, filtros, detalhe, carrinho e resumo copiável.
- [x] Criar `DESIGN.md`, `PLAN.md`, manifesto e screenshots demonstrativos.

## Fase 1 — Alinhar implementação Next.js (código incluído; validação de build pendente)

- [x] Importar o CSS de identidade `src/app/official-theme.css` depois do CSS preexistente.
- [x] Trocar cabeçalho e hero do catálogo para a composição oficial.
- [x] Atualizar os cards da grade para botão amarelo com nome, numeração e preço separados da imagem.
- [x] Integrar SVGs de marca e hero no frontend.
- [x] Aplicar cores no admin via classes existentes.
- [ ] Rodar `npm install`, `npm run typecheck`, `npm run build` em ambiente com registro npm disponível.
- [ ] Conferir visualmente o Next.js real contra a prévia HTML e o mockup aprovado.
- [ ] Ajustar pontos de diferença: proporções, quebra de texto, altura de produto e margens.

## Fase 2 — Verificação comercial (obrigatória antes da publicação)

- [ ] Confirmar idioma de cada uma das 11 cartas (o arquivo de montagem não basta).
- [ ] Confirmar condições NM/SP através de fotografias físicas, não de arte renderizada.
- [ ] Confirmar estoque por exemplar no painel.
- [ ] Confirmar número comercial do WhatsApp em `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Substituir imagens de verso das montagens por fotos reais, se os anúncios afirmarem ser imagens do exemplar.
- [ ] Confirmar a denominação comercial/expansão correta; `Seleção Shiny` é apenas agrupamento da loja.
- [ ] Confirmar Zapdos japonês dourado e seus atributos, antes de permitir compra como estoque real.
- [ ] Validar links de imagem, moeda, quantidade e texto do resumo.

## Fase 3 — Supabase e segurança

- [ ] Criar/selecionar projeto Supabase correto (sem assumir que algum projeto antigo é este).
- [ ] Executar e revisar esquema `supabase/schema.sql` num ambiente de homologação.
- [ ] Manter RLS em todas as tabelas públicas; somente `admin_users` modifica o inventário.
- [ ] Importar cartas inicialmente como `is_published=false`, `stock=0`.
- [ ] Criar usuário admin manualmente; não permitir autoatribuição de papel.
- [ ] Conferir `NEXT_PUBLIC_SUPABASE_URL`, publishable key e bucket de imagens.
- [ ] Testar políticas SELECT de catálogo público e INSERT/UPDATE autorizados com contas distintas.
- [ ] Garantir que chaves `service_role`/secret nunca cheguem ao cliente.

## Fase 4 — Fluxos ponta a ponta

1. Cliente abre catálogo e pesquisa `Zapdos`.
2. Consulta imagem e alterna frente/verso.
3. Adiciona ao carrinho; altera quantidade; recarrega a página e mantém o carrinho.
4. Testa item indisponível e atualização de quantidade após reconciliação de estoque.
5. Clica em finalizar; app consulta estoque no backend e prepara texto com itens e subtotal.
6. Se WhatsApp configurado, abre `wa.me`; o cliente envia manualmente.
7. Se não configurado, pedido pode ser copiado sem número fictício.
8. Administrador acessa `/admin`, altera preço e estoque, arquiva produto e confirma atualização pública.
9. Usuário não autenticado tenta gravar no banco e é bloqueado por RLS.

## Fase 5 — Publicação

- [ ] Versionar projeto no repositório escolhido e configurar Vercel.
- [ ] Definir variáveis de ambiente de produção e restrições de CORS/storage.
- [ ] Verificar domínio, SSL, ícone e metadados.
- [ ] Fazer smoke test desktop e mobile no domínio publicado.
- [ ] Confirmar que **modo demo não aparece como estoque real**.
- [ ] Publicar somente cartas com estoque e condição conferidos.

## Arquivos de entrada/saída

| Caminho | Finalidade |
|---|---|
| `assets/reference/mockup-aprovado.jpg` | Fonte de verdade visual |
| `DESIGN.md` | Design system, estrutura e regras |
| `PLAN.md` | Entrega técnica e aceite |
| `ASSETS.md` | Manifesto de arquivos e proveniência |
| `app/` | Fonte Next.js e testes existentes |
| `app/src/app/official-theme.css` | Camada visual oficial |
| `app/public/brand/` | SVGs de identidade própria |
| `app/public/illustrations/` | Hero e estado vazio vetoriais |
| `app/public/cards/shiny/` | Fotos e recortes do catálogo |
| `preview/index.html` | Protótipo HTML independente |
| `previews/` | Capturas estáticas de desktop/mobile |

## Testes realizados no pacote

- Teste automatizado da prévia com Chromium por `page.set_content`, usando assets incorporados em memória: **11/11 imagens disponíveis**, filtro por Snorlax, abertura de detalhe, add ao carrinho, navegação admin, viewport desktop e mobile sem scroll horizontal.
- Os navegadores bloqueiam navegação local `file://` e `localhost` neste ambiente; por isso a automação carregou o HTML em memória. Isso não valida o servidor Next.js em execução.
- Integração de Next.js com Supabase e build de produção **não foram validados aqui**.

## Definição de pronto

O projeto estará pronto para publicação quando: design aprovado visualmente no navegador Next.js; informações dos exemplares conferidas; painel protegido; catálogo sem produtos fictícios apresentados como estoque; carrinho WhatsApp revalidado; testes responsivos e fluxo ponta a ponta aprovados; e deploy Vercel operacional.
