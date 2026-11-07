-- EduTrainer TCG — lote Shiny extraído das três montagens enviadas.
-- Confirme as fotos reais, condição NM e quantidade antes de colocar os cards à venda.
-- Estoque 0 e is_published=false por segurança até validação no painel.
-- Paths de imagem são locais à aplicação Next.js e precisam ser publicados junto ao site.
-- Pode reexecutar sem duplicar; alterações do administrador serão preservadas.

INSERT INTO public.products (id, name, set_name, card_number, category, language, condition, finish, rarity, price_cents, stock, front_url, back_url, is_published) VALUES
  ('944a109e-b87d-50ff-9f8f-7d71c4e1d20e', 'Zapdos LV.30', 'Beat of the Frontier (Pt3)', '100/100', 'Shiny', 'Japonês', 'NM', 'Foil', 'Shiny', 39990, 0, '/cards/shiny/zapdos-japones-foto-original.webp', '/cards/shiny/zapdos-shiny-100-100-back.webp', false),
  ('74d74dbf-7b5b-5065-86f6-c7b78e646195', 'Snorlax', 'Paldean Fates', '202/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 17990, 0, '/cards/shiny/snorlax-202-091-hq.webp', '/cards/shiny/snorlax-202-091-back.webp', false),
  ('960bf706-0aeb-57f3-bb47-c4fa41056c54', 'Pikachu', 'Paldean Fates', '131/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 16990, 0, '/cards/shiny/pikachu-131-091-hq.webp', '/cards/shiny/pikachu-131-091-back.webp', false),
  ('06ed863f-2bd9-5edd-ac35-7a26f20d08eb', 'Charmeleon', 'Destinos de Paldea', '110/091', 'Shiny', 'Português', 'NM', 'Foil', 'Rara Shiny', 14990, 0, '/cards/shiny/charmeleon-110-091-front.webp', '/cards/shiny/charmeleon-110-091-back.webp', false),
  ('bc3506d4-e232-57ee-bf0f-dbf67d1d1637', 'Lucario', 'Paldean Fates', '174/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 11990, 0, '/cards/shiny/lucario-174-091-hq.webp', '/cards/shiny/lucario-174-091-back.webp', false),
  ('031739e1-9cf1-523d-89af-993c179b7241', 'Charmander', 'Paldean Fates', '109/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 10990, 0, '/cards/shiny/charmander-109-091-hq.webp', '/cards/shiny/charmander-109-091-back.webp', false),
  ('47b14061-e1e7-5e0b-bff8-48e36efd3c34', 'Ditto', 'Destinos de Paldea', '201/091', 'Shiny', 'Português', 'NM', 'Foil', 'Rara Shiny', 9990, 0, '/cards/shiny/ditto-201-091-front.webp', '/cards/shiny/ditto-201-091-back.webp', false),
  ('cfd51a45-2f1e-525d-a49b-0cf270066f28', 'Slowpoke', 'Paldean Fates', '116/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 5990, 0, '/cards/shiny/slowpoke-116-091-hq.webp', '/cards/shiny/slowpoke-116-091-back.webp', false),
  ('e88b33d9-36ce-5064-b8f0-c721de812d7f', 'Riolu', 'Paldean Fates', '173/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 4990, 0, '/cards/shiny/riolu-173-091-hq.webp', '/cards/shiny/riolu-173-091-back.webp', false),
  ('491d8c91-7b7b-5cb6-81f9-d4b7dc5ff525', 'Sneasel', 'Paldean Fates', '182/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 2990, 0, '/cards/shiny/sneasel-182-091-hq.webp', '/cards/shiny/sneasel-182-091-back.webp', false),
  ('f24f24e0-cc51-50e7-84ff-61e953d693c9', 'Oddish', 'Paldean Fates', '092/091', 'Shiny', 'Inglês', 'NM', 'Foil', 'Shiny Rare', 2490, 0, '/cards/shiny/oddish-092-091-hq.webp', '/cards/shiny/oddish-092-091-back.webp', false)
ON CONFLICT (id) DO NOTHING;
