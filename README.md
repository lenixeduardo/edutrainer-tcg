# EduTrainer TCG — MVP do catálogo

Catálogo web responsivo com carrinho e finalização por WhatsApp, além de um painel admin com autenticação Supabase, fotos frente/verso, preços e estoque.

## Novidade — 11 cartas recebidas nas montagens

Foram incluídas as cartas Zapdos Shiny, Snorlax, Pikachu, Charmeleon, Lucario, Charmander, Ditto, Slowpoke, Riolu, Sneasel e Oddish, com os números e valores exibidos nas três imagens do usuário. A soma dos preços individuais é **R$ 1.393,90**. A categoria **Shiny** aparece nos filtros.

As **22 imagens de frente e verso** em `public/cards/shiny/` são **recortes diretos das montagens** fornecidas, sem recriar nem alterar a arte. O "verso" mostrado nessas montagens é apenas uma representação visual, **não uma fotografia independente do verso físico**. A condição **NM**, o acabamento **Foil**, a expansão oficial e a quantidade de cada exemplar não podem ser comprovados pelas montagens. O nome "Seleção Shiny" é um agrupamento comercial, não uma identificação oficial de expansão. Solicite/insira fotos individuais da frente e do verso e confira a condição antes de publicar.

**Demo:** as 11 cartas substituem os cinco exemplos antigos; cada uma é marcada como 1 unidade **somente para testar o carrinho**, e não representa confirmação de disponibilidade.

**Supabase real:** execute `supabase/2026-add-shiny-category.sql` se já tiver criado a tabela com a versão antiga do projeto. Depois execute `supabase/import-shiny-cards.sql` para cadastrar as 11 cartas como **rascunhos, estoque 0**, sem publicá-las; no painel `/admin`, confirme os dados, configure a quantidade real e publique. Se ainda não criou o banco, execute `supabase/schema.sql` antes de importar. A importação não duplica itens nem substitui alterações prévias do vendedor.

Planilha para revisão: `data/shiny-cards.csv`. Registro dos recortes e suas coordenadas: `data/shiny-cards-source.json`.


## O que está implementado

- Página pública com busca por nome/coleção/número, filtros por categoria, idioma, condição, disponibilidade e ordenação.
- Detalhes com frente/verso em proporção original (sem esticar cartas).
- Carrinho com quantidades limitadas ao estoque, persistido no navegador.
- Resumo de pedido com preços e condições, enviado por `wa.me` (ou copiável).
- Revalidação de disponibilidade antes de abrir o WhatsApp. **A conversa não reserva a carta automaticamente.**
- Painel `/admin`: login com Supabase Auth, lista de cartas, cadastro/edição, foto via upload, publicação/arquivamento, quantidade em estoque.
- RLS para catálogo público (só publicadas) e para gravações (apenas contas explicitamente autorizadas em `admin_users`).
- Modo demonstração: caso as variáveis Supabase não estejam presentes, o catálogo apresenta as 11 cartas das montagens com estoque simulado e o painel permite alterações **somente no localStorage desse navegador**. Este modo não é uma loja compartilhada.

## Executar

Requer Node.js >=20 e acesso ao registro npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000` para a loja e `http://localhost:3000/admin` para o painel.

> Sem variáveis, o sistema entra em modo demo. Os preços do lote Shiny reproduzem os valores exibidos nas montagens; quantidade e condição precisam ser confirmadas. Não há vendas ou dados comerciais reais carregados por padrão.

## Configurar o Supabase

1. Crie um projeto Supabase novo e execute `supabase/schema.sql` no SQL Editor. Inspecione o arquivo antes da execução.
2. Em Authentication > Users, crie a conta do vendedor manualmente. Não existe cadastro público de admins.
3. Execute o comando de concessão no final do SQL (substituindo `SEU_EMAIL_REAL`). Isso adiciona o `auth.users.id` da sua conta em `public.admin_users`.
4. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no `.env.local`. Use a chave *publishable*, **nunca** uma secret/service role.
5. Configure `NEXT_PUBLIC_WHATSAPP_NUMBER` usando DDI e DDD somente com dígitos: por exemplo, `5511999999999` (apenas exemplo de formato).
6. Reinicie o processo `npm run dev` após alterar variáveis e cadastre as cartas em `/admin`.

As permissões não dependem de e-mail no frontend: o banco valida `auth.uid()` contra `admin_users`. A URL do painel é pública, mas as alterações são bloqueadas por RLS. Desative o cadastro público em Supabase Auth caso não seja necessário.

## Publicar na Vercel

1. Envie os arquivos do projeto para um repositório Git.
2. Importe o repositório como projeto Next.js na Vercel.
3. Inclua as três variáveis `NEXT_PUBLIC_*` acima nas configurações de ambiente da Vercel.
4. Execute o deploy. O catálogo de produção inicialmente estará vazio. Importe o lote Shiny por `supabase/import-shiny-cards.sql` como rascunhos e confirme os dados antes de publicar.
5. Faça login em `/admin`, cadastre a primeira carta real, confirme foto, condição, idioma, preço e estoque. Verifique o fluxo de carrinho no domínio publicado.

## Testes

```bash
npm run test:logic
npm run test:seed
npm run typecheck
npm run build
```

`test:logic` requer o `tsc` disponível (é instalado como devDependency). Compile e faça testes funcionais após instalar dependências. A validação visual e o build Next.js dependem de um ambiente com acesso ao npm.

## Observações importantes

- Não há checkout com pagamento online, login de compradores ou cálculo automático de frete no MVP. Valores e estoque são confirmados na conversa.
- A URL `wa.me` abre o WhatsApp; o cliente precisa enviar a mensagem manualmente.
- O administrador marca como reservado/vendido manualmente diminuindo o estoque ou arquivando a carta. Não existe reserva atômica quando o carrinho é enviado.
- Fotos podem ser armazenadas no Supabase Storage. É responsabilidade da loja usar imagens de cartas com autorização ou fotos próprias.
- O catálogo de demonstração pode utilizar imagens de referência de cartas existentes, **sem edição das ilustrações**. Esse catálogo demo não contém inventário real.
- Para versão de produção de maior escala: mover a validação de checkout para API própria, adicionar inventário de múltiplos exemplares, tracking de intents e logs de alteração.

**Validação deste pacote:** testes de regras de negócio (13), testes de importação/ativos (11 registros e 22 arquivos) e verificação de sintaxe JS da prévia passaram. O build Next.js e a prévia visual em navegador não foram completamente validados neste ambiente, pois dependências de React/Next não estão instaladas e a navegação do navegador de testes foi bloqueada.
