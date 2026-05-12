# RelanceIA

Phase 0 — sondage de validation et distribution sur WhatsApp et Facebook.

Stack : Next.js 14 (pages router), Supabase (Postgres avec RLS), Tailwind, déployé sur Vercel.

## Routes

- `/` — landing avec preuves chiffrées et hiérarchie de l'argument commercial
- `/form` — sondage de 5 questions pour qualifier les répondants
- `/admin` — tableau de bord protégé par mot de passe, export CSV, critère Go/No-Go
- `/share` — cinq messages prêts à publier, liens directs WhatsApp et Facebook, six groupes ciblés, checklist du jour 1
- `/api/submit` — POST avec whitelist côté serveur
- `/api/responses` — GET protégé par header `x-admin-password`

## Démarrage local

```bash
cd relancia
bash scripts/setup.sh
```

Le script vérifie Node, installe les dépendances, crée `.env.local` à partir de `.env.example`, lance un build de contrôle.

## Configuration Supabase

1. Créer un projet sur https://supabase.com
2. SQL Editor → coller le contenu de `supabase/schema.sql` et exécuter
3. Settings → API → copier dans `.env.local` :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

La clé `service_role` ne doit jamais être committée. Elle reste exclusivement côté serveur.

## Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=mot-de-passe-fort
NEXT_PUBLIC_SITE_URL=https://relancia.vercel.app
```

## Tests en local

```bash
npm run dev
```

Vérifier :
- http://localhost:3000 (landing)
- http://localhost:3000/form (remplir une réponse de test)
- http://localhost:3000/admin (entrer `ADMIN_PASSWORD`, vérifier la réponse)
- http://localhost:3000/share (vérifier les messages générés)

## Déploiement Vercel

Option 1 — interface web :

1. Pousser le code sur GitHub
2. https://vercel.com → Add new → Project → importer le repo
3. Environment Variables : copier les 5 variables de `.env.local`
4. Deploy
5. Mettre à jour `NEXT_PUBLIC_SITE_URL` avec l'URL réelle et redéployer

Option 2 — CLI :

```bash
bash scripts/deploy.sh
```

## Critère de validation Phase 0

L'objectif minimal pour considérer la Phase 0 réussie :

- 8 réponses qualifiées au sondage
- 3 répondants qui sélectionnent "Oui, sans hésiter" sur la question du pricing 9-19 €/mois

En-dessous de ce seuil, l'idée doit être ajustée avant tout développement supplémentaire (changer la cible, le pricing, ou le périmètre fonctionnel).

## Sécurité

- RLS Supabase activée sur la table `responses`, aucune policy configurée — donc aucun accès via la clé anonyme. Les écritures et lectures passent exclusivement par les API server-side avec la clé `service_role`.
- Whitelist côté serveur dans `/api/submit` — une requête malicieuse ne peut pas injecter de valeurs non prévues.
- L'administration est protégée par mot de passe via le header `x-admin-password`. Le mot de passe est stocké dans `sessionStorage` côté client (pas en cookie persistant), donc invalidé à la fermeture de l'onglet.
- Aucun PDF stocké en Phase 0 : seules les réponses du sondage sont enregistrées. L'email est collecté avec consentement explicite via un champ optionnel.

## Structure

```
relancia/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   ├── form.js
│   ├── admin.js
│   ├── share.js
│   └── api/
│       ├── submit.js
│       └── responses.js
├── lib/supabaseAdmin.js
├── supabase/schema.sql
├── scripts/
│   ├── setup.sh
│   └── deploy.sh
├── styles/globals.css
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── .env.example
```

## Étapes suivantes

Si la Phase 0 valide (3 "Oui" minimum) :

1. Email aux répondants qualifiés pour annoncer le calendrier MVP.
2. Construction du MVP : extraction PDF par Vision, scoring par Haiku, envoi des relances par Brevo.
3. Beta avec les 5 premiers utilisateurs payants à la semaine 3.
4. Lancement payant ouvert à la semaine 4 ou 5.

Si la Phase 0 ne valide pas :

1. Analyser les "Peut-être" et "Non" pour identifier la raison principale du rejet.
2. Pivot possible : freelances B2B (montants moyens plus élevés) ou cabinets comptables (cible avec budget logiciel établi).
