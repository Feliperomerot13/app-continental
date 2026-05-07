-- Continental Feria - Supabase schema
-- Ejecutar en Supabase SQL Editor en un proyecto nuevo.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  modulo text not null check (modulo in ('ruleta', 'recomendador', 'catalogo', 'asesoria')),

  nombre text,
  empresa text,
  cargo text,
  celular text,
  correo text,
  ciudad text,
  tipo_empresa text,

  producto_interes text,
  comentario text,

  proceso text,
  sustrato text,
  necesidad text,
  aplicacion text,
  producto_recomendado text,
  producto_alterno text,
  confianza text,

  premio text,
  acepta_datos boolean not null default false,
  acepta_contacto boolean not null default false,

  tags text[] not null default '{}',
  payload jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_modulo_idx on public.leads (modulo);
create index if not exists leads_premio_idx on public.leads (premio);
create index if not exists leads_producto_recomendado_idx on public.leads (producto_recomendado);

alter table public.leads enable row level security;

-- La app desplegada usa /api/leads en Vercel con SUPABASE_SERVICE_ROLE_KEY para leer,
-- exportar y borrar desde el panel admin. Esa key nunca debe ir al navegador.
--
-- Esta política permite que, si se configura VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
-- para desarrollo local sin Vercel API, el navegador pueda insertar registros.
create policy "anon can insert leads"
on public.leads
for insert
to anon
with check (true);

create policy "authenticated can insert leads"
on public.leads
for insert
to authenticated
with check (true);

grant usage on schema public to anon, authenticated;
grant insert on public.leads to anon, authenticated;
