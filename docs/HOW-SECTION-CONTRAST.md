# Correção de contraste — Como comprar

Captura do iPhone de 08/11/2026: as etapas 01/02/03 apareciam em um fundo `#F3F8FF` com títulos quase brancos e descrições cinzas de baixo contraste.

**Causa:** o CSS de `globals.css` define cores claras para a seção usada originalmente sobre fundo escuro. O tema aprovado `official-theme.css` mudou o fundo para azul-claro, mas não sobrescreveu `h3` e `p`.

**Correção localizada:** `h3` em `#101E39`, parágrafos/sobretítulo em `#44566E`, números em `#235C9D`. Sem alterar o fundo, a composição, a responsividade, o logo ou as imagens.

Teste `npm run test:contrast` exige contraste WCAG AA de pelo menos 4,5:1 para títulos, descrições e números. Testar também a leitura no iPhone em 375 e 390 CSS px após o deploy.
