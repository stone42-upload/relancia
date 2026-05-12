#!/usr/bin/env bash
# RelanceIA — setup automatique
# Usage : bash scripts/setup.sh
#
# Ce script :
#  1) Vérifie node/npm
#  2) Installe les dépendances
#  3) Crée .env.local depuis .env.example si manquant
#  4) Lance un build de vérification
#  5) Démarre le dev server (optionnel)

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[setup]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[x]${NC} $1"; }

# 1. Node
if ! command -v node >/dev/null 2>&1; then
  err "Node.js n'est pas installé. Installe-le depuis https://nodejs.org (>= 18.17)"
  exit 1
fi
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  err "Node $NODE_MAJOR détecté. Requis : >= 18.17"
  exit 1
fi
log "Node $(node -v) OK"

# 2. Dépendances
log "Installation des dépendances (npm install)..."
npm install --silent

# 3. .env.local
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  warn ".env.local créé depuis .env.example — édite-le AVANT de déployer :"
  echo "       - NEXT_PUBLIC_SUPABASE_URL"
  echo "       - NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "       - SUPABASE_SERVICE_ROLE_KEY"
  echo "       - ADMIN_PASSWORD"
  echo "       - NEXT_PUBLIC_SITE_URL (après deploy Vercel)"
else
  log ".env.local déjà présent"
fi

# 4. Build de vérification
log "Build de vérification (npm run build)..."
if npm run build > /tmp/relancia-build.log 2>&1; then
  log "Build OK"
else
  err "Build échoué. Logs :"
  tail -n 30 /tmp/relancia-build.log
  exit 1
fi

# 5. Récap
echo
log "Setup terminé."
echo
echo "Prochaines étapes :"
echo "  1. Crée un projet Supabase → https://supabase.com"
echo "  2. SQL Editor → colle le contenu de supabase/schema.sql et exécute"
echo "  3. Settings → API → copie URL, anon key et service_role key dans .env.local"
echo "  4. Édite ADMIN_PASSWORD dans .env.local"
echo "  5. Lance le dev : npm run dev (puis ouvre http://localhost:3000)"
echo "  6. Déploie sur Vercel : voir scripts/deploy.sh"
echo
