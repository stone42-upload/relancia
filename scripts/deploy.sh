#!/usr/bin/env bash
# RelanceIA — déploiement Vercel (CLI)
# Usage : bash scripts/deploy.sh
#
# Requiert : vercel CLI installé (npm i -g vercel)
# Astuce : tu peux aussi déployer en cliquant "Import" sur https://vercel.com (plus simple la 1re fois).

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[x]${NC} $1"; }

if ! command -v vercel >/dev/null 2>&1; then
  warn "Vercel CLI non installé. Installation globale..."
  npm install -g vercel
fi

if [ ! -f .env.local ]; then
  err ".env.local manquant. Lance d'abord : bash scripts/setup.sh"
  exit 1
fi

# Charge les variables locales pour les pousser sur Vercel
log "Lecture des variables de .env.local..."
set -a
# shellcheck disable=SC1091
source .env.local
set +a

log "Push des variables d'environnement vers Vercel (production)..."
push_env() {
  local key="$1"
  local val="$2"
  if [ -z "$val" ]; then
    warn "$key vide, ignoré"
    return
  fi
  # Supprime si existait, puis ajoute
  vercel env rm "$key" production -y >/dev/null 2>&1 || true
  echo "$val" | vercel env add "$key" production >/dev/null 2>&1
  log "  $key ✓"
}

push_env NEXT_PUBLIC_SUPABASE_URL "${NEXT_PUBLIC_SUPABASE_URL:-}"
push_env NEXT_PUBLIC_SUPABASE_ANON_KEY "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"
push_env SUPABASE_SERVICE_ROLE_KEY "${SUPABASE_SERVICE_ROLE_KEY:-}"
push_env ADMIN_PASSWORD "${ADMIN_PASSWORD:-}"
push_env NEXT_PUBLIC_SITE_URL "${NEXT_PUBLIC_SITE_URL:-}"

log "Déploiement en production..."
vercel --prod

log "✅ Déploiement terminé."
echo
echo "Vérifie :"
echo "  - https://[ton-domaine]/        (landing)"
echo "  - https://[ton-domaine]/form    (sondage)"
echo "  - https://[ton-domaine]/admin   (dashboard)"
echo "  - https://[ton-domaine]/share   (hub de partage WhatsApp/Facebook)"
