import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";

// Configuration centrale des messages — édite ici pour adapter le ton.
const POSTS = [
  {
    id: "general",
    label: "Post général (micro-entrepreneurs)",
    body: `Salut les micro-entrepreneurs 👋

Je crée un outil IA qui analyse vos factures en retard et envoie automatiquement des relances personnalisées (sans avoir l'air d'un robot).

Je cherche 10 personnes pour tester gratuitement et me dire ce qu'elles en pensent.

Formulaire de 2 min : {LINK}

Merci 🙏`,
  },
  {
    id: "tresorerie",
    label: "Post 'Trésorerie/Impayés'",
    body: `Les impayés = cauchemar ? 😫

J'ai lancé RelanceIA :
1. Tu upload tes factures
2. L'IA analyse qui risque de pas payer
3. Elle envoie les relances automatiquement

Vous testez gratuitement ? {LINK}

14 jours gratuits, je veux juste vos retours honnêtes. 🚀`,
  },
  {
    id: "perso",
    label: "Post 'plus perso/témoignage'",
    body: `Coucou 👋

Je sais que beaucoup galèrent avec les impayés (2-5h/mois à relancer, 30% de factures en retard, stress…).

Je viens de lancer le MVP d'un outil IA qui :
• Analyse les factures en 2 sec
• Prédit qui va payer en retard
• Génère et envoie les relances pour toi

Gratuit 14 jours en avant-première. Ça vous intéresse ?

Petit sondage 2 min : {LINK}

Merci 🙏`,
  },
  {
    id: "whatsapp_court",
    label: "Message WhatsApp court (1-to-1)",
    body: `Salut ! Tu m'avais parlé de tes galères de relances de factures. Je viens de lancer RelanceIA — l'IA analyse tes factures, prédit qui paye en retard et envoie les relances pour toi.

Tu testes ? Sondage rapide (2 min) : {LINK}

Si t'as 15 min on s'appelle 🙏`,
  },
  {
    id: "whatsapp_statut",
    label: "Statut WhatsApp (court)",
    body: `🚀 Je cherche 10 micro-entrepreneurs qui galèrent avec les impayés.

Je lance RelanceIA — l'IA s'occupe des relances pour toi.

Sondage 2 min + accès gratuit : {LINK}`,
  },
];

const FACEBOOK_GROUPS = [
  { name: "Auto-entrepreneurs France", url: "https://www.facebook.com/search/groups/?q=auto-entrepreneurs%20france" },
  { name: "Micro-entrepreneurs & Freelances", url: "https://www.facebook.com/search/groups/?q=micro-entrepreneurs%20freelances" },
  { name: "Freelances francophones", url: "https://www.facebook.com/search/groups/?q=freelances%20francophones" },
  { name: "Indépendants & TPE France", url: "https://www.facebook.com/search/groups/?q=ind%C3%A9pendants%20TPE%20France" },
  { name: "Créateurs d'entreprise France", url: "https://www.facebook.com/search/groups/?q=cr%C3%A9ateurs%20entreprise%20france" },
  { name: "Entrepreneurs France (réseautage)", url: "https://www.facebook.com/search/groups/?q=entrepreneurs%20france" },
];

export default function SharePage() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    const base = typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_SITE_URL || `${window.location.protocol}//${window.location.host}`)
      : "";
    setLink(`${base}/form`);
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  function fill(body) {
    return body.replace(/\{LINK\}/g, link);
  }

  async function copy(id, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback : sélection manuelle
      window.prompt("Copie ce texte manuellement :", text);
    }
  }

  function whatsappURL(text) {
    // wa.me/?text=... ouvre WhatsApp (mobile = app, desktop = WhatsApp Web)
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  function facebookShareURL(url) {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  }

  async function nativeShare(text) {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "RelanceIA — Sondage 2 min",
        text,
        url: link,
      });
    } catch {}
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <Head><title>Hub de partage — RelanceIA</title></Head>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← RelanceIA</Link>
        <h1 className="text-3xl font-bold mt-2 mb-2">Hub de partage</h1>
        <p className="text-slate-600 mb-6">
          Copie les posts en 1 clic, ouvre WhatsApp ou les groupes Facebook directement. Objectif Phase 0 : 8+ réponses, 3+ "Oui".
        </p>

        {/* Lien du formulaire */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Lien à partager</div>
            <div className="font-mono text-sm truncate">{link || "..."}</div>
          </div>
          <button
            onClick={() => copy("link", link)}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700 whitespace-nowrap"
          >
            {copied === "link" ? "✓ Copié" : "Copier"}
          </button>
        </div>

        {/* Posts */}
        <h2 className="text-xl font-bold mb-3">📝 Posts prêts à l'emploi</h2>
        <div className="space-y-4 mb-10">
          {POSTS.map((p) => {
            const text = fill(p.body);
            return (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="font-semibold">{p.label}</div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => copy(p.id, text)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
                    >
                      {copied === p.id ? "✓ Copié" : "📋 Copier"}
                    </button>
                    <a
                      href={whatsappURL(text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      💬 WhatsApp
                    </a>
                    <a
                      href={facebookShareURL(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    >
                      📘 Facebook
                    </a>
                    {canNativeShare && (
                      <button
                        onClick={() => nativeShare(text)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm"
                      >
                        📤 Partager…
                      </button>
                    )}
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 rounded-lg p-4 text-slate-700">
{text}
                </pre>
              </div>
            );
          })}
        </div>

        {/* WhatsApp ciblé */}
        <h2 className="text-xl font-bold mb-3">💬 WhatsApp — workflow recommandé</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-10">
          <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
            <li>Liste 10-15 personnes de ton réseau (micro-entrepreneurs, freelances, indépendants) dans WhatsApp.</li>
            <li>Clique le bouton <b>💬 WhatsApp</b> sur le post "Message court (1-to-1)" → ça ouvre WhatsApp avec le texte pré-rempli.</li>
            <li>Choisis le contact, envoie. Personnalise le prénom si tu veux (10 sec).</li>
            <li>Publie aussi en <b>statut WhatsApp</b> (le post "Statut court") pour toucher tous tes contacts d'un coup.</li>
            <li>Reviens demain checker <Link href="/admin" className="text-brand-600 hover:underline">/admin</Link> pour voir les réponses.</li>
          </ol>
        </div>

        {/* Groupes Facebook */}
        <h2 className="text-xl font-bold mb-3">📘 Groupes Facebook ciblés</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-10">
          <p className="text-sm text-slate-600 mb-4">
            Clique chaque lien pour ouvrir la recherche du groupe sur Facebook. Vérifie les règles avant de poster (certains demandent l'approbation de l'admin).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FACEBOOK_GROUPS.map((g) => (
              <a
                key={g.name}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm"
              >
                <span>{g.name}</span>
                <span className="text-slate-400">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <h2 className="text-xl font-bold mb-3">✅ Checklist jour 1</h2>
        <Checklist />
      </div>
    </main>
  );
}

function Checklist() {
  const items = [
    "Copier le lien et le tester (cliquer dessus, remplir une réponse test)",
    "Poster sur ton statut WhatsApp (visible par tous tes contacts pendant 24h)",
    "Envoyer le message 1-to-1 à 10 personnes ciblées dans WhatsApp",
    "Poster dans 2-3 groupes Facebook aujourd'hui",
    "Poster dans 2-3 autres groupes demain (ne pas tout poster d'un coup)",
    "Checker /admin tous les soirs pour relancer les emails qualifiés",
  ];
  const [done, setDone] = useState(() => Array(items.length).fill(false));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("relancia_checklist") || "null");
      if (Array.isArray(saved) && saved.length === items.length) setDone(saved);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem("relancia_checklist", JSON.stringify(done)); } catch {}
  }, [done]);

  function toggle(i) {
    setDone((arr) => arr.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-12">
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={done[i]}
                onChange={() => toggle(i)}
                className="mt-1 w-5 h-5 accent-indigo-600"
              />
              <span className={`text-sm ${done[i] ? "line-through text-slate-400" : "text-slate-700"}`}>{it}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
