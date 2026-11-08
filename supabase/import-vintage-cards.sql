-- Novas cartas de coleção: importação conservadora em banco real.
-- Por segurança, publicadas apenas na demo local; banco fica em rascunho sem estoque.
-- Revisar fotos do verso, acabamento e preço NM antes de publicar no banco.
INSERT INTO public.products (id, name, set_name, card_number, category, language, condition, finish, rarity, price_cents, stock, front_url, back_url, is_published) VALUES
('ebfb7e64-d958-5ec5-bcca-3ccd811a5301','Haunter','Evolutions','048/108','Vintage','Inglês','NM','Normal','Uncommon',800,0,'/cards/vintage/haunter-048-108-a.webp','',false),
('e56c6eef-2a78-55d6-ad6b-b8e2952b25a1','Mewtwo','Evolutions','051/108','Vintage','Inglês','NM','Normal','Rare',13000,0,'/cards/vintage/mewtwo-051-108.webp','',false),
('5ef96c7d-76a9-58fb-ab3f-67cc93b02bd5','Machamp','Evolutions','059/108','Vintage','Inglês','NM','Foil','Rare Holo',0,0,'/cards/vintage/machamp-059-108.webp','',false),
('0e0da525-cbd6-5d54-a6b2-952115c04084','Hitmonchan','Evolutions','062/108','Vintage','Inglês','NM','Foil','Rare Holo',1500,0,'/cards/vintage/hitmonchan-062-108-a.webp','',false),
('60485173-ad81-5232-8777-ab50ea19217b','Misty''s Determination','Evolutions','080/108','Vintage','Inglês','NM','Normal','Uncommon',1000,0,'/cards/vintage/mistys-determination-080-108.webp','',false),
('dd28c604-7c5a-5b85-b1d7-06502350d2f0','Fairy Energy','Evolutions','099/108','Vintage','Inglês','NM','Normal','Common',100,0,'/cards/vintage/fairy-energy-099-108.webp','',false),
('571c8be8-0b3e-54c7-9dea-78adb8b062a3','Here Comes Team Rocket!','Evolutions','113/108','Vintage','Inglês','NM','Normal','Secret Rare',0,0,'/cards/vintage/here-comes-team-rocket-113-108.webp','',false),
('67dd1ef7-3ddb-58ff-beda-a0514e74cac6','Dewgong','Evolutions','029/108','Vintage','Inglês','NM','Normal','Rare',2000,0,'/cards/vintage/dewgong-029-108.webp','',false),
('7217ea73-0a27-5606-a479-5f5df21bb10f','Starmie','Evolutions','031/108','Vintage','Inglês','NM','Normal','Rare',1000,0,'/cards/vintage/starmie-031-108.webp','',false),
('69481f5d-2307-5e47-b30e-51c8c6e15f4a','Magikarp','Evolutions','033/108','Vintage','Inglês','NM','Normal','Common',500,0,'/cards/vintage/magikarp-033-108.webp','',false),
('d52a89b0-f932-569e-98a3-41a6d22b88d2','Pikachu','Evolutions','035/108','Vintage','Inglês','NM','Normal','Common',5000,0,'/cards/vintage/pikachu-035-108.webp','',false),
('af1c4253-fb38-5837-9ae3-fc15cad9a2d0','Magneton','Evolutions','038/108','Vintage','Inglês','NM','Reverse Foil','Rare Holo',8000,0,'/cards/vintage/magneton-038-108.webp','',false),
('e56e4b34-58c7-57ba-b026-592ba7b08ae8','Electrode','Evolutions','040/108','Vintage','Inglês','NM','Normal','Rare',2500,0,'/cards/vintage/electrode-040-108.webp','',false),
('bbdee41e-b7f5-5bc1-a02e-9b4da3196bf4','Electabuzz','Evolutions','041/108','Vintage','Inglês','NM','Normal','Common',500,0,'/cards/vintage/electabuzz-041-108.webp','',false),
('cd51dde9-3c8d-5e4d-8d8f-64d0121001b6','Gastly','Evolutions','047/108','Vintage','Inglês','NM','Normal','Common',800,0,'/cards/vintage/gastly-047-108.webp','',false),
('fa910605-4159-5e11-ad3c-fcd128ba3672','Misty''s Wrath','Gym Heroes','114/132','Vintage','Inglês','NM','Normal','Uncommon',0,0,'/cards/vintage/mistys-wrath-114-132.webp','',false),
('ca1a4390-c3ab-52c1-ace1-2d0a830c5f38','Misty''s Duel','Gym Heroes','123/132','Vintage','Inglês','NM','Normal','Common',0,0,'/cards/vintage/mistys-duel-123-132.webp','',false),
('83fda5b0-1e1a-537a-832f-6644feb03d47','Smoochum','Neo Revelation','054/064','Vintage','Inglês','NM','Normal','Common',5000,0,'/cards/vintage/smoochum-054-064.webp','',false),
('4ef53bfc-f70b-526f-b6dc-9344bfc03399','Beedrill','Base Set','017/102','Vintage','Inglês','NM','Normal','Rare',1800,0,'/cards/vintage/beedrill-007-108-a.webp','',false),
('ea6172a7-1648-5668-a278-97b042561060','Beedrill','Evolutions','007/108','Vintage','Inglês','NM','Normal','Rare',1000,0,'/cards/vintage/beedrill-007-108-b.webp','',false),
('a9c3410b-164d-5052-a644-5b881393cb66','Charmander','Evolutions','009/108','Vintage','Inglês','NM','Normal','Common',300,0,'/cards/vintage/charmander-009-108.webp','',false),
('7d125b47-e36c-5f70-a643-1fde9b7ffef3','Charmeleon','Evolutions','010/108','Vintage','Inglês','NM','Normal','Uncommon',3000,0,'/cards/vintage/charmeleon-010-108.webp','',false),
('45733035-597b-5891-91a5-8362fb52cfe3','Vulpix','Evolutions','014/108','Vintage','Inglês','NM','Normal','Common',1500,0,'/cards/vintage/vulpix-014-108.webp','',false),
('5aaa2df1-bae3-56b1-847e-92d0e6a178b0','Arcanine','Evolutions','018/108','Vintage','Inglês','NM','Normal','Uncommon',1600,0,'/cards/vintage/arcanine-018-108.webp','',false)
ON CONFLICT (id) DO NOTHING;
