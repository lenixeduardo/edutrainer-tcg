-- EduTrainer TCG MVP — executar uma única vez no SQL Editor do Supabase.
-- Não exponha service_role no navegador.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

drop policy if exists "admin can see own membership" on public.admin_users;
create policy "admin can see own membership" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  set_name text not null check (char_length(btrim(set_name)) between 1 and 120),
  card_number text not null check (char_length(btrim(card_number)) between 1 and 40),
  category text not null default 'Outras' check (category in ('Vintage','Arte Rara','Full Art','Promo','Shiny','Outras')),
  language text not null default 'Português' check (language in ('Português','Inglês','Japonês','Chinês','Coreano','Outro')),
  condition text not null default 'NM' check (condition in ('NM','SP','MP','HP')),
  finish text not null default 'Normal' check (finish in ('Normal','Foil','Reverse Foil')),
  rarity text not null default '',
  price_cents integer not null check (price_cents >= 0),
  stock integer not null default 0 check (stock >= 0 and stock <= 99999),
  front_url text not null default '',
  back_url text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create index if not exists products_public_idx on public.products(is_published, created_at desc);
create index if not exists products_set_name_idx on public.products(set_name);

-- O comprador só enxerga cartas publicadas.
-- Apenas IDs presentes em admin_users têm permissões de escrita.
drop policy if exists "catalog public or admin select" on public.products;
drop policy if exists "catalog public select" on public.products;
create policy "catalog public select" on public.products
  for select to anon, authenticated
  using (is_published = true);

drop policy if exists "admin sees drafts" on public.products;
create policy "admin sees drafts" on public.products
  for select to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "admin insert" on public.products;
create policy "admin insert" on public.products
  for insert to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "admin update" on public.products;
create policy "admin update" on public.products
  for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "admin delete" on public.products;
create policy "admin delete" on public.products
  for delete to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Política de API explícita para projetos com grants restritos.
grant usage on schema public to anon, authenticated;
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant select on public.admin_users to authenticated;

-- Bucket público apenas para leitura. Escrita restrita por RLS a administradores.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('card-images','card-images',true,6291456,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "card images public read" on storage.objects;
create policy "card images public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'card-images');

drop policy if exists "admin image upload" on storage.objects;
create policy "admin image upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'card-images' and exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  ));

drop policy if exists "admin image update" on storage.objects;
create policy "admin image update" on storage.objects
  for update to authenticated
  using (bucket_id = 'card-images' and exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  ))
  with check (bucket_id = 'card-images' and exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  ));

drop policy if exists "admin image delete" on storage.objects;
create policy "admin image delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'card-images' and exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  ));

-- ETAPA MANUAL: crie o usuário via Authentication > Users;
-- no SQL Editor, substitua o e-mail abaixo e execute somente para sua conta:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'SEU_EMAIL_REAL'
-- on conflict (user_id) do nothing;
