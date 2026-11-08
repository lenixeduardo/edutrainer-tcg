# Banner pré-rodapé — correção da imagem no mobile (2026-11-08)

## Correções implementadas
- Foto anterior: `edutrainer-pokebola-photo.avif`, 5.810 bytes, 520×313 pixels, compressão intensa.
- Nova foto: `edutrainer-collector-photo-hd-v2.avif`, 139.903 bytes, 1094×701 pixels, extraída da composição aprovada `edutrainer-banner-pokebola-corrigido.png` (2244×701).
- O recorte original da fotografia remove todos os textos impressos na metade esquerda do banner original. Foi usado o quadro horizontal x=1150 até 2244.
- A legenda sobreposta `Imagem ilustrativa · confira as fotos individuais no catálogo` foi removida do HTML e do CSS.
- No mobile a foto mantém a proporção real `1094/701`, evitando recortes arbitrários. Mantida a descrição acessível (`alt`), que não é sobreposta à imagem.
- Hero superior, identidade Poké Bola, estoque, preços, carrinho e WhatsApp não foram alterados.

## Validação
- Confirmar HTTP 200 do novo arquivo AVIF e do site.
- Verificar posicionamento em 375/390 px e confirmar que o banner aparece depois da seção "Como comprar" e antes do footer.
- A ilustração original das cartas é uma composição visual; fotos reais individuais permanecem na ficha de cada produto.
