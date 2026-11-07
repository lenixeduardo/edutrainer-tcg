# EduTrainer TCG — Padrão de imagens e inspeção de cartas

## Referências utilizadas

- Limitless TCG Pocket: https://pocket.limitlesstcg.com/cards/C1/173 — estrutura de imagem grande + metadados.
- Pokémon TCG, Reinado Delta: https://tcg.pokemon.com/pt-br/expansions/delta-reign/ — foco na ilustração e na apresentação da carta.
- Mockup white mode EduTrainer aprovado: branco `#FFFFFF`, azul `#3D7DCA`, azul-marinho `#003A70` e amarelo `#FFCB05`.

O layout não reproduz a identidade visual, marcas ou ilustrações novas de terceiros.

## Qualidade dos arquivos

1. Imagens de **frente e verso** capturadas separadamente, com ao menos 1.200 px de largura e, idealmente, 1.500–2.000 px; proporção natural preservada.
2. Sem filtros de IA, pintura, interpolação fictícia, distorção de perspectiva ou substituição da arte original da carta.
3. Para avaliar condição física, preferir fotos reais do exemplar anunciado, com bordas e cantos visíveis e boa iluminação. Um recorte de montagem **não** comprova condição NM/SP.
4. Identificar se cada arquivo é *foto do exemplar* ou *imagem de referência*. O giro 360° usa apenas duas imagens 2D e **não** equivale a digitalização 3D ou à inspeção das bordas.
5. Campo `front_url` é a imagem exibida inicialmente; `back_url` é o verso. Ao substituir uma foto pelo painel, usar o arquivo original sem aumento artificial de resolução.
6. O visualizador exibe as **dimensões naturais** da imagem, oferece ampliação por toque/clique, gesto de pinça e panorâmica, além de avisos de baixa resolução.

## Auditoria do acervo recebido — 7/nov/2026

Os dez recortes Shiny existentes possuem frentes com largura aproximada de 244 a 259 px e versos com 233 a 245 px. O Zapdos japonês possui foto de frente de 678×938 px; seu verso disponível continua sendo um recorte ilustrativo de 234×367 px. Nenhum desses arquivos atinge a meta de 1.200 px para inspeção detalhada.

**Pendente de insumos:** 11 fotografias ou digitalizações frontais completas de alta resolução e 11 imagens reais dos versos dos exemplares à venda. Os atuais arquivos devem ser considerados referências até sua substituição e verificação.

## Critérios de aceite

- Desktop: galeria de carta com imagem predominante, informações completas, zoom e frente/verso; proporções sem achatamento.
- Mobile: galeria em tela cheia, botões tocáveis, gesto de pinça, rolagem vertical sem invasão pelo carrinho.
- Giro 360° preservado, com comandos manuais e respeito à preferência de movimento reduzido.
- Nenhum aumento sintético ou texto afirmando inspeção/condição confirmada no modo demo.
- O build, testes automatizados e navegação em navegadores reais precisam ser verificados após cada deploy.
