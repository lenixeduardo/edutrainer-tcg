-- Execute somente se a tabela products já existir e for anterior à categoria Shiny.
-- Em uma instalação nova, o schema.sql já contém esta categoria.
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products ADD CONSTRAINT products_category_check
  CHECK (category IN ('Vintage', 'Arte Rara', 'Full Art', 'Promo', 'Shiny', 'Outras'));
