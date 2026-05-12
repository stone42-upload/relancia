-- RelanceIA - schema Supabase
-- A executer dans SQL Editor du projet Supabase
-- Idempotent : peut etre re-execute sans casser une base existante.

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text,
  email text,
  micro_entrepreneur text,
  factures_retard text,
  temps_relances text,
  pret_a_payer text,
  methode_actuelle text,
  user_agent text,
  referer text
);

-- Migration douce : ajoute les colonnes manquantes si la table existait deja.
alter table public.responses add column if not exists prenom text;
alter table public.responses add column if not exists micro_entrepreneur text;

-- Index pour requetes admin
create index if not exists responses_created_at_idx on public.responses (created_at desc);
create index if not exists responses_pret_a_payer_idx on public.responses (pret_a_payer);
create index if not exists responses_factures_retard_idx on public.responses (factures_retard);

-- RLS : aucun acces via cle anonyme. service_role only.
alter table public.responses enable row level security;
