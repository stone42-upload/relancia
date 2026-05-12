import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

const POSTS = [
  { id: "general", label: "Post general - groupes micro-entrepreneurs", body: "Question pour les micro-entrepreneurs.\n\nCombien d'heures par mois tu passes a relancer tes clients pour des factures impayees ?\n\nJe construis RelanceIA : l'IA analyse tes factures, identifie les clients a risque, et envoie des relances qui marchent vraiment. Je cherche 10 testeurs avant le lancement.\n\nSondage 2 minutes, pas de carte bancaire, pas de spam : {LINK}\n\nSi tu fais partie des 10 premiers, tu as 6 mois d'acces gratuit au produit." },
  { id: "tresorerie", label: "Post focus tresorerie", body: "27% des factures B2B en France sont payees avec plus de 30 jours de retard. Sur un revenu annuel de 30 000 EUR, ca represente 4 200 EUR bloques chez tes clients.\n\nJe construis RelanceIA pour corriger ca :\n- Tu uploades tes factures\n- L'IA predit qui va payer en retard\n- Elle envoie les relances pour toi, au bon moment, avec le bon ton\n\n10 places de beta-testeurs gratuits. Sondage 2 min : {LINK}" },
  { id: "perso", label: "Post ton personnel", body: "Salut.\n\nJe construis un outil pour les micro-entrepreneurs qui galerent avec les impayes. Pas une startup avec 10 fondateurs et 3 millions leves : juste moi, qui ai vu trop de freelances perdre du temps et de l'argent sur des relances qui ne marchent pas.\n\nAvant de coder, je veux comprendre comment tu travailles. 2 minutes de ton temps contre 6 mois gratuits du produit fini.\n\nSondage : {LINK}\n\nMerci." },
  { id: "whatsapp_court", label: "Message WhatsApp 1 a 1", body: "Salut. Tu m'avais parle de tes galeres de factures impayees.\n\nJe viens de lancer RelanceIA : l'IA analyse tes factures, predit qui paye en retard, et envoie les relances pour toi.\n\nAvant le lancement, je cherche 10 beta-testeurs. Acces gratuit 6 mois en echange de ton feedback.\n\nTu as 2 minutes pour le sondage ? {LINK}\n\nOn peut s'appeler 15 min apres si ca t'interesse." },
  { id: "whatsapp_statut", label: "Statut WhatsApp court", body: "Je cherche 10 micro-entrepreneurs qui galerent avec les impayes.\n\nRelanceIA : l'IA s'occupe des relances.\n\nSondage 2 min + 6 mois gratuits pour les 10 premiers : {LINK}" },
];

const FACEBOOK_GROUPS = [
  { name: "Auto-entrepreneurs France", url: "https://www.facebook.com/search/groups/?q=auto-entrepreneurs%20france" },
  { name: "Micro-entrepreneurs et freelances", url: "https://www.facebook.com/search/groups/?q=micro-entrepreneurs%20freelances" },
  { name: "Freelances francophones", url: "https://www.facebook.com/search/groups/?q=freelances%20francophones" },
  { name: "Independants et TPE France", url: "https://www.facebook.com/search/groups/?q=ind%C3%A9pendants%20TPE%20France" },
  { name: "Createurs d'entreprise France", url: "https://www.facebook.com/search/groups/?q=cr%C3%A9ateurs%20entreprise%20france" },
  { name: "Reseau d'entrepreneurs France", url: "https://www.facebook.com/search/groups/?q=entrepreneurs%20france" },
];

export default function SharePage() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_SITE_URL || window.location.protocol + "//" + window.location.host) : "";
    setLink(base + "/form");
    if (typeof navigator !== "undefined" && navigator.share) setCanNativeShare(true);
  }, []);

  const fill = (b) => b.replace(/\{LINK\}/g, link);

  async function copy(id, text) {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); }
    catch { window.prompt("Copie ce texte manuellement :", text); }
  }

  const waURL = (t) => "https://wa.me/?text=" + encodeURIComponent(t);
  const fbURL = (u) => "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(u);

  async function nativeShare(text) {
    if (!navigator.share) return;
    try { await navigator.share({ title: "RelanceIA - Sondage 2 min", text, url: link }); } catch {}
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-zinc-900 dark:text-white">
      <Head><title>Distribution - RelanceIA</title></Head>
      <header className="border-b border-zinc-200 dark:border-zinc-800/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Phase 0 - Distribution</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Diffuser le sondage</h1>
        <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mb-8 leading-relaxed">Cinq messages prets a publier, six groupes Facebook cibles, des liens directs WhatsApp. Objectif minimal : 8 reponses qualifiees et 3 "Oui" avant de coder le MVP.</p>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#1E2937] p-5 mb-10 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Lien public du sondage</p>
            <p className="font-mono text-sm truncate">{link || "Chargement..."}</p>
          </div>
          <button onClick={() => copy("link", link)} className="h-10 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium whitespace-nowrap transition">{copied === "link" ? "Copie" : "Copier le lien"}</button>
        </div>

        <h2 className="text-lg font-semibold mb-4">Messages prets a publier</h2>
        <div className="space-y-4 mb-12">
          {POSTS.map((p) => {
            const text = fill(p.body);
            return (
              <div key={p.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#1E2937] p-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">Format</p>
                    <p className="font-semibold">{p.label}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => copy(p.id, text)} className="h-8 px-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm">{copied === p.id ? "Copie" : "Copier"}</button>
                    <a href={waURL(text)} target="_blank" rel="noopener noreferrer" className="h-8 px-3 inline-flex items-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm">Ouvrir WhatsApp</a>
                    <a href={fbURL(link)} target="_blank" rel="noopener noreferrer" className="h-8 px-3 inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm">Ouvrir Facebook</a>
                    {canNativeShare && <button onClick={() => nativeShare(text)} className="h-8 px-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm">Partager</button>}
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm bg-zinc-50 dark:bg-[#0F172A]/60 rounded-xl p-4 text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-100 dark:border-zinc-800">{text}</pre>
              </div>
            );
          })}
        </div>

        <h2 className="text-lg font-semibold mb-3">Groupes Facebook cibles</h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#1E2937] p-5 mb-12">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-5">Lis les regles avant de poster. Certains groupes demandent l'approbation prealable de l'admin (24 a 48 h).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FACEBOOK_GROUPS.map((g) => (
              <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#0F172A]/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm">
                <span>{g.name}</span>
                <span className="text-zinc-400 text-xs">Ouvrir</span>
              </a>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3">Checklist du jour 1</h2>
        <Checklist />
      </main>
    </div>
  );
}

function Checklist() {
  const items = [
    "Copier le lien du sondage et le tester avec une fausse reponse.",
    "Publier le format Statut WhatsApp (visible 24 h, faible friction).",
    "Envoyer le message WhatsApp 1 a 1 a 10 contacts cibles.",
    "Publier dans 2 a 3 groupes Facebook aujourd'hui.",
    "Publier dans 2 a 3 autres groupes demain (etaler l'effort).",
    "Consulter /admin chaque soir et relancer les repondants par email.",
  ];
  const [done, setDone] = useState(() => Array(items.length).fill(false));

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("relancia_checklist") || "null"); if (Array.isArray(s) && s.length === items.length) setDone(s); } catch {}
  }, []);

  useEffect(() => { try { localStorage.setItem("relancia_checklist", JSON.stringify(done)); } catch {} }, [done]);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#1E2937] p-5 mb-16">
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={done[i]} onChange={() => setDone((a) => a.map((v, idx) => idx === i ? !v : v))} className="mt-1 w-5 h-5 accent-emerald-500" />
              <span className={"text-sm leading-relaxed " + (done[i] ? "line-through text-zinc-400" : "text-zinc-700 dark:text-zinc-200")}>{it}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
