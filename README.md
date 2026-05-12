# RelanceIA — Phase 0 (validation + hub de partage WhatsApp/Facebook)

Stack : **Next.js 14** (pages router) + **Supabase** (Postgres + RLS) + **Tailwind** + **Vercel**.

5 routes :

- `/` — landing
- `/form` — sondage 5 questions (validation Phase 0)
- `/admin` — dashboard mot de passe + export CSV
- `/share` — hub de partage : posts pré-écrits, deeplinks **WhatsApp** + **Facebook**, groupes ciblés, checklist
- `/api/submit` (POST) + `/api/responses` (GET protégé)

## ⚡ Démarrage rapide (10-15 min)

### 1. Setup local (3 min)

```bash
cd relancia
bash scripts/setup.sh
```

Le script vérifie Node, installe les deps, crée `.env.local`, lance un build de contrôle.

### 2. Créer le projet Supabase (3 min)

1. Va sur https://supabase.com → **New project**
2. Une fois créé, ouvre **SQL Editor** → colle le contenu de `supabase/schema.sql` → **Run**
3. Va dans **Settings → API** et copie :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (cliquer "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ Ne **jamais** committer la `service_role` key. Elle reste serveur-side uniquement.

### 3. Éditer `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=un-mot-de-passe-fort
NEXT_PUBLIC_SITE_URL=https://relancia.vercel.app
```

### 4. Tester en local (1 min)

```bash
npm run dev
```

Ouvre :
- http://localhost:3000 (landing)
- http://localhost:3000/form (remplis une réponse test)
- http://localhost:3000/admin (entre `ADMIN_PASSWORD`, vérifie ta réponse)
- http://localhost:3000/share (vérifie les posts)

### 5. Déployer (Vercel)

**Option A — Dashboard (recommandé la 1re fois) :**

1. Push ton code sur GitHub
2. https://vercel.com → **Add new… → Project** → importer le repo
3. **Environment Variables** : copie les 5 vars de `.env.local` (sans les guillemets)
4. **Deploy**
5. Récupère ton URL → mets-la dans `NEXT_PUBLIC_SITE_URL` et redéploie

**Option B — CLI :**

```bash
bash scripts/deploy.sh
```

### 6. Lancer la Phase 0 🚀

1. Ouvre `https://[ton-domaine]/share`
2. La page **WhatsApp + Facebook** te donne :
   - Le lien public à partager (`/form`)
   - 5 posts pré-écrits (général, trésorerie, perso, WhatsApp 1-to-1, statut WhatsApp)
   - Bouton **💬 WhatsApp** sur chaque post → ouvre WhatsApp avec texte pré-rempli
   - Bouton **📘 Facebook** → ouvre le sharer Facebook
   - Bouton **📤 Partager** (mobile, Web Share API native)
   - 6 raccourcis vers les groupes Facebook ciblés
   - Checklist persistante (sauvegardée en local)
3. Workflow recommandé :
   - **Statut WhatsApp** : publie le "Statut court" (visible 24h par tous tes contacts)
   - **WhatsApp 1-to-1** : envoie le "Message court" à 10-15 contacts ciblés
   - **Facebook** : poste 2-3 groupes aujourd'hui, 2-3 demain (étale dans le temps)
4. Surveille `/admin` :
   - Objectif **Phase 0 = 8+ réponses + 3+ "Oui"** sur le pricing 9-19 €/mois
   - Une bannière verte `✅ GO` s'affiche dès 3 "Oui"
5. Pour les répondants avec email + "Oui"/"Peut-être" → appel 15 min (voir script dans la conversation précédente)

## 🔐 Sécurité

- **RLS activé** sur la table `responses`, **aucune policy** = aucun accès via clé anonyme. Les écritures et lectures passent uniquement par l'API server-side avec la `service_role`.
- **Whitelist server-side** des valeurs envoyées (`/api/submit`) → un curl malicieux ne peut pas insérer n'importe quoi.
- **Admin protégé** par mot de passe (header `x-admin-password`). Stocké en `sessionStorage`, jamais en cookie.
- **Aucun PDF** stocké en Phase 0 (juste les réponses du sondage). RGPD : email collecté avec consentement explicite ("optionnel").

## 📁 Structure

```
relancia/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js          → Landing
│   ├── form.js           → Sondage 5 questions (progress bar)
│   ├── admin.js          → Dashboard + GO/NO-GO + export CSV
│   ├── share.js          → Hub WhatsApp + Facebook
│   └── api/
│       ├── submit.js     → POST whitelist + RLS
│       └── responses.js  → GET protégé mot de passe
├── lib/supabaseAdmin.js  → Client service_role (server-only)
├── supabase/schema.sql   → Table + RLS verrouillée
├── scripts/
│   ├── setup.sh          → Setup auto (Node + deps + build)
│   └── deploy.sh         → Push env vars + deploy Vercel CLI
├── styles/globals.css
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── .env.example
```

## 🛣️ Phase suivante

Si Phase 0 ✅ (3+ "Oui") :

1. Email aux répondants qualifiés : "Merci, MVP arrive semaine X, tu auras accès gratuit."
2. Build MVP (extraction PDF Vision + scoring Haiku + relances Brevo) — voir prompts dans la conversation.
3. Beta 5 users, jour 22 lancement payant.

Si Phase 0 ❌ (< 3 "Oui") :

1. Re-lire les "Peut-être" et "Non" → pourquoi ?
2. Pivot possible : freelances B2B (factures plus grosses), ou cabinets comptables.
