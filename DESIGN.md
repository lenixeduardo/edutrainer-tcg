# EduTrainer TCG — DESIGN.md

> **Referência visual aprovada:** `assets/reference/mockup-aprovado.jpg` (imagem fornecida pelo proprietário em 07/11/2026). Este arquivo é a fonte de verdade para as decisões de composição; nenhuma referência anterior ao projeto *Direct from Japan* faz parte deste escopo.

## 1. Objetivo do produto

Catálogo web de cartas Pokémon colecionáveis destinado a visitantes no Brasil. A pessoa pesquisa cartas, consulta imagem de frente e verso, coloca itens no carrinho e encaminha uma **solicitação de compra** pelo WhatsApp. O pagamento e a disponibilidade final são combinados no atendimento, não na loja.

O MVP existente inclui Next.js, banco Supabase opcional, autenticação para o vendedor e uma demo local. A alteração deste kit é **primariamente visual** e preserva essas regras de negócio.

## 2. Identidade aprovada — white mode

| Token | Valor | Uso |
|---|---|---|
| `--et-yellow` | `#FFCB05` | CTA principal e chips selecionados |
| `--et-blue` | `#3D7DCA` | Links, ícones, indicações de interação |
| `--et-navy` | `#003A70` | Marca e headings institucionais |
| `--et-white` | `#FFFFFF` | Fundo da loja, cards, painéis |
| `--et-canvas` | `#F5F8FD` | Fundos de seção e inputs |
| `--et-pale-blue` | `#EEF5FE` | Banner de apresentação |
| `--et-ink` | `#101E39` | Texto principal |
| `--et-muted` | `#62738A` | Metadados e descrições |
| `--et-border` | `#DCE6F3` | Divisórias e bordas |
| `--et-red` | `#EE1515` | Somente erros ou alertas reais; não é decoração |

**Proibido nesta identidade:** roxo, violeta, gradientes roxos, neon, brilhos artificiais, coroas, símbolos oficiais de Pokémon no logo, cópia de logotipos de marketplaces, distorcer a arte das cartas ou criar artes artificiais indistinguíveis de cards autênticos.

As cores são inspiradas na identidade clássica Pokémon, mas **o símbolo do EduTrainer é próprio:** três retângulos estilizados representando cartas, em contorno amarelo. Os SVGs usam apenas formas geométricas originais. Não reproduzir a Pokébola ou o lettering Pokémon no logotipo.

## 3. Sistema tipográfico

- Família: **Inter**, pesos 400, 500, 600, 700 e 800/900.
- Título hero: 36px no desktop, 23–27px no mobile, altura de linha 1.15, peso 800.
- Heading da seção: 22px desktop; 19px mobile.
- Nome da carta: 14px desktop; 12–13px mobile, peso 800.
- Preço: 17–18px desktop; 14–15px mobile, peso 900 e cor azul.
- Atributos e números: 11–12px, contraste suficiente com a superfície.
- A tipografia não deve ficar escondida dentro de imagens de banners; use conteúdo HTML acessível.

## 4. Anatomia das telas

### Catálogo desktop (principal)

1. Header branco compacto, marca à esquerda, descrição curta, nav central e carrinho à direita.
2. Hero azul-claro com texto à esquerda e ilustração vetorial **abstrata** de três cartas à direita. Sem cards Pokémon produzidos por IA no hero.
3. Busca por nome, expansão e número; filtros em chips; ordenação por valor.
4. Grade de **4 colunas** acima de 1120px. Cards brancos com borda azul-acinzentada, imagem completa, nome, número, preço e botão amarelo.
5. Seção de ajuda/como comprar e rodapé. Não usar a montagem *Direct from Japan*.

### Catálogo mobile

- Larguras alvo 390px e 375px, além de 768px.
- Header reduzido, cart/badge e acesso à navegação.
- Hero textual compacto; ilustração decorativa pode ser omitida no mobile.
- Busca em linha própria; chips em scroll horizontal.
- Grade **2 colunas** sem cortar cards; ação `+ Carrinho` em largura integral em cada card.
- Barra fixa inferior de carrinho, com subtotal e contagem no mockup funcional.

### Detalhe de produto

- Foto de frente com `object-fit: contain` e proporção original; alternador **Frente/Verso**.
- Número, idioma, acabamento, condição, preço e estoque **somente se confirmados**.
- CTA de carrinho e aviso de que o envio do pedido não é uma reserva.
- Fotos provenientes de montagens devem ser descritas como **referência visual**, nunca como prova do estado físico ou da autenticidade da carta.

### Carrinho / WhatsApp

- Lista com imagem, nome/número, quantidade, subtotal e remoção.
- Quantidades revalidadas com produtos atuais antes do redirecionamento.
- Abrir `https://wa.me/<numero>?text=<urlencoded>` somente com número comercial real configurado.
- Sem número configurado, oferecer **copiar pedido**; jamais usar telefone inventado.
- Mensagem enviada pelo cliente, não automaticamente pelo aplicativo.

### Admin

- Acesso autenticado; sem cadastro público de administradores.
- Lista com imagem, nome, numeração, preço, quantidade e status de publicação.
- Produtos recém-importados: **rascunho + estoque zero**, até revisão manual.
- A edição de disponibilidade no painel altera o que é exibido somente após persistência no Supabase.

## 5. Geometria e componentes

| Componente | Desktop | Mobile |
|---|---|---|
| Container | até 1300px; padding 28px | padding 14–19px |
| Header | altura 80px | 68px |
| Hero | raio 18–19px; fundo `#EEF5FE` | raio 14px; sem ilustração |
| Product grid | 4 colunas / gap 14px | 2 colunas / gap 10px |
| Product card | border 1px; raio 14–15px | raio 12px |
| Foto | preservar proporção com `contain`; nunca `cover` | idem |
| Chip | pill com borda; ativo amarelo | rolagem horizontal |
| Botão CTA | amarelo, texto navy, estados hover/focus | largura adaptável |
| Mobile sticky cart | oculto | fixo na borda inferior |

**Relação das cartas:** o formato de uma carta padrão é aproximadamente **63:88**. Fotografias podem conter perspectiva e bordas de sleeve; não corrigir ou esticar a ilustração via IA. Não confundir crop com imagem completa.

## 6. Diretório de assets

```text
app/public/
  brand/
    logo-mark.svg
    logo-horizontal.svg
    favicon.svg
  illustrations/
    hero-card-outlines.svg
    empty-cart.svg
  cards/shiny/
    <11 imagens de frente/extraídas ou foto original>
    <11 imagens de verso (referências das montagens)>
assets/reference/
  mockup-aprovado.jpg
previews/
  desktop-catalog.png
  mobile-catalog.png
  desktop-admin.png
  mobile-admin.png
```

O Zapdos utiliza a foto japonesa dourada fornecida posteriormente (`zapdos-japones-foto-original.webp`), mantendo o recorte original anterior como referência de origem. Revisar nome, idioma, acabamento e estado antes da publicação.

## 7. Referências externas: cinco sites verificados

As referências orientam padrões de UX, **não** a identidade cromática nem o layout copiado. URLs consultáveis:

1. **TCGplayer** — pesquisa de cartas, impressão e raridade: https://cart.tcgplayer.com/pokemon
2. **Cardmarket** — navegação de singles, expansão, disponibilidade, ordenação: https://www.cardmarket.com/en/Pokemon/Products/Singles
3. **CardTrader** — coleções e expansão por jogo: https://www.cardtrader.com/en-US/pokemon
4. **Collecta TCG** — apresentação compacta de singles e preços em reais: https://www.collectatcg.com.br/singles/pokemon
5. **TCG Vision** — filtros brasileiros por idioma, NM/SP, número e set: https://tcgvision.com.br/mercado

## 8. Acessibilidade e qualidade

- HTML semântico; navegação por teclado em busca, cards, chips, carrinho e editor.
- Foco visível azul e contraste mínimo recomendado WCAG AA para conteúdo funcional.
- Todo produto recebe texto alternativo com nome e número.
- Estados de carregamento, vazio, erro e indisponível diferenciados.
- `prefers-reduced-motion` respeitado.
- Não embutir preços ou condições nas imagens de produtos; exibir dados em HTML.
- Testar 1440, 1024, 768, 390 e 375px sem scroll horizontal.
- Fotos da frente e do verso não são intercambiáveis; a montagem original do verso não é prova de um exemplar físico.

## 9. Critérios de aceite visuais

- [ ] O mockup aprovado é reconhecível na composição de topo, filtros e grade.
- [ ] White mode obrigatório; nenhum acento roxo ou neon.
- [ ] Marca própria e idêntica nos módulos da loja e painel.
- [ ] 11 cartas e respectivos valores exibidos corretamente na demo.
- [ ] Imagens sem achatamento e sem substituição da arte por IA.
- [ ] Nenhum depoimento, número de vendas, estoque real ou selo de autenticidade sem evidência.
- [ ] Mobile com grade de 2 colunas, carrinho acessível e áreas de toque adequadas.

## 10. Separação entre protótipo e produção

- **Prévia HTML**: demonstrativa, com carrinho local e copiar mensagem; não confirma estoque nem abre o WhatsApp sem número comercial real.
- **Next.js**: lógica de catálogo e administração existente preservada; o CSS oficial é carregado depois do CSS base.
- **Produção**: requer Supabase, conta administrativa, imagens físicas para os anúncios, estoque conferido, WhatsApp e deploy na Vercel.
