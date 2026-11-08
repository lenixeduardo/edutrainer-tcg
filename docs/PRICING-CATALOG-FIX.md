# Revisão dos anúncios com preços baixos — 2026-11-08

O catálogo tem política comercial de lucro mínimo líquido estimado de R$20 **somente quando o custo de aquisição do exemplar é conhecido**.

Nesta atualização, doze anúncios vintage sem custo confirmado que exibiam valores de R$1 até R$20 foram alterados para "Sob consulta". Nenhum preço de custo foi inventado e a condição NM não foi alterada. O anúncio Machamp já estava sob consulta.

- Haunter 048/108 R$8.00
- Hitmonchan 062/108 R$15.00
- Fairy Energy 099/108 R$1.00
- Dewgong 029/108 R$20.00
- Starmie 031/108 R$10.00
- Magikarp 033/108 R$5.00
- Electabuzz 041/108 R$5.00
- Beedrill 017/102 R$18.00
- Beedrill 007/108 R$10.00
- Charmander 009/108 R$3.00
- Vulpix 014/108 R$15.00
- Arcanine 018/108 R$16.00

A triagem automática transforma anúncios desconhecidos abaixo de R$23 em "Sob consulta" e bloqueia salvá-los pelo painel. O valor R$23 é um limite conservador **de triagem**, não uma garantia de lucro. A margem real depende do custo da carta, taxas, embalagem, tributos e frete. Anúncios de preço mais elevado sem custo confirmado **também** exigem conferência de margem antes da venda.

A interface pública não exibe mais o banner "AMBIENTE DE DEMONSTRAÇÃO", mas continua informando que estoque e condições do exemplar devem ser confirmados antes da compra. Não há mudança na infraestrutura: sem Supabase a edição do catálogo permanece local ao navegador; não apresentar isso como persistência de produção.

A chave de armazenamento local foi migrada de v7 para v8 para evitar que valores antigos de R$3 e R$5 reapareçam. Carrinhos antigos deixam de incluir itens agora classificados como Sob consulta. 
