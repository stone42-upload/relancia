-- RelanceIA — schéma Supabase
-- À exécuter dans SQL Editor du projet Supabase

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  factures_retard text,
  temps_relances text,
  pret_a_payer text,
  methode_actuelle text,
  email text,
  user_agent text,
  referer text
);

-- Index pour requêtes admin
create index if not exists responses_created_at_idx
  on public.responses (created_at desc);

create index if not exists responses_pret_a_payer_idx
  on public.responses (pret_a_payer);

-- RLS : on bloque tout accès anon ; seule la service_role (côté serveur Next.js)
-- peut écrire/lire. Le formulaire passe par /api/submit, qui utilise la service_role.
alter table public.responses enable row level security;

-- Aucune policy = aucun accès via les clés publiques. Parfait.
-- Si tu veux ouvrir une lecture publique plus tard, ajoute une policy ici.
