import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

const POSTS = [
  { id: "general", label: "Post general - groupes micro-entrepreneurs", body: "Question pour les micro-entrepreneurs.\n\nCombien d'heures par mois tu passes a relancer tes clients pour des factures impayees ?\n\nJe construis RelanceIA : l'IA analyse tes factures, identifie les clients a risque, et envoie des relances qui marchent vraiment. Je cherche 10 testeurs avant le lancement.\n\nSondage 2 minutes, pas de carte bancaire, pas de spam : {LINK}\n\nSi tu fais partie des 10 premiers, tu as 6 mois d'acces gratuit au produit." },
  { id: "tresorerie", label: "Post focus tresorerie", body: "27% des factures B2B en France sont payees avec plus de 30 jours de retard.\n\nJe construis RelanceIA pour corriger ca :\n- Tu uploades tes factures\n- L'IA predit qui va payer en retard\n- Elle envoie les relances pour toi\n\n10 places de beta-testeurs gratuits. Sondage 2 min : {LINK}" },
  { id: "perso", label: "Post ton personnel", body: "Salut.\n\nJe construis un outil pour les micro-entrepreneurs qui galerent avec les impayes. Avant de coder, je veux comprendre comment tu travailles. 2 minutes de ton temps contre 6 mois gratuits du produit fini.\n\nSondage : {LINK}\n\nMerci." },
  { id: "whatsapp_court", label: "Message WhatsApp 1 a 1", body: "Salut. Je viens de lancer RelanceIA : l'IA analyse tes factures et envoie les relances pour toi.\n\nAvant le lancement, je cherche 10 beta-testeurs. Acces gratuit 6 mois.\n\nSondage 2 min : {LINK}" },
  { id: "whatsapp_statut", label: "Statut WhatsApp court", body: "Je cherche 10 micro-entrepreneurs qui galerent avec les impayes.\n\nRelanceIA : l'IA s'occupe des relances.\n\nSondage 2 min + 6 mois gratuits : {LINK}" },
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
    catch { window.prompt("Copie manuellement :", text); }
  }
  const waURL = (t) => "https://wa.me/?text=" + encodeURIComponent(t);
  const fbURL = (u) => "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(u);
  async function nativeShare(text) { if (!navigator.share) return; try { await navigator.share({ title: "RelanceIA", text, url: link }); } catch {} }

  return (
    <div className="min-h-screen bg-grad-light dark:bg-grad-dark text-ink-900 dark:text-bone-100">
      <Head><title>Distribution - RelanceIA</title></Head>
      <header className="border-b border-ink-900/5 dark:border-bone-100/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <p className="text-xs uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55 mb-2">Phase 0 - Distribution</p>
        <h1 className="serif text-4xl md:text-5xl text-ink-900 dark:text-bone-50 mb-4">Diffuser le sondage</h1>
        <p className="text-ink-900/75 dark:text-bone-100/75 max-w-2xl mb-10 leading-relaxed">Cinq messages prets a publier, six groupes Facebook cibles, des liens directs WhatsApp. Objectif minimal : 8 reponses qualifiees et 3 "Oui" avant de coder le MVP.</p>

        <div className="rounded-2xl border border-ink-900/5 dark:border-bone-100/10 bg-white/60 dark:bg-white/[0.03] p-5 mb-10 flex items-center gap-4 flex-wrap backdrop-blur-sm">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55 mb-1">Lien public</p>
            <p className="font-mono text-sm truncate">{link || "Chargement..."}</p>
          </div>
          <button onClick={() => copy("link", link)} className="h-10 px-5 rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 text-sm font-medium whitespace-nowrap transition">{copied === "link" ? "Copie" : "Copier le lien"}</button>
        </div>

        <h2 className="serif text-2xl text-ink-900 dark:text-bone-50 mb-4">Messages prets a publier</h2>
        <div className="space-y-4 mb-12">
          {POSTS.map((p) => {
            const text = fill(p.body);
            return (
              <div key={p.id} className="rounded-2xl border border-ink-900/5 dark:border-bone-100/10 bg-white/60 dark:bg-white/[0.03] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55">Format</p>
                    <p className="font-medium">{p.label}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => copy(p.id, text)} className="h-8 px-3 rounded-full bg-ink-900/5 dark:bg-bone-100/10 hover:bg-ink-900/10 dark:hover:bg-bone-100/20 text-sm">{copied === p.id ? "Copie" : "Copier"}</button>
                    <a href={waURL(text)} target="_blank" rel="noopener noreferrer" className="h-8 px-3 inline-flex items-center rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 text-sm">WhatsApp</a>
                    <a href={fbURL(link)} target="_blank" rel="noopener noreferrer" className="h-8 px-3 inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm">Facebook</a>
                    {canNativeShare && <button onClick={() => nativeShare(text)} className="h-8 px-3 rounded-full bg-ink-900 dark:bg-bone-50 text-bone-50 dark:text-ink-900 text-sm">Partager</button>}
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm bg-ink-900/[0.03] dark:bg-bone-100/[0.03] rounded-xl p-4 text-ink-900/75 dark:text-bone-100/75 leading-relaxed border border-ink-900/5 dark:border-bone-100/5">{text}</pre>
              </div>
            );
          })}
        </div>

        <h2 className="serif text-2xl text-ink-900 dark:text-bone-50 mb-3">Groupes Facebook cibles</h2>
        <div className="rounded-2xl border border-ink-900/5 dark:border-bone-100/10 bg-white/60 dark:bg-white/[0.03] p-5 mb-16 backdrop-blur-sm">
          <p className="text-sm text-ink-900/75 dark:text-bone-100/75 mb-5">Lis les regles avant de poster. Certains groupes demandent l'approbation prealable (24 a 48 h).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FACEBOOK_GROUPS.map((g) => (
              <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-xl bg-ink-900/[0.03] dark:bg-bone-100/[0.03] hover:bg-ink-900/[0.06] dark:hover:bg-bone-100/[0.06] border border-ink-900/5 dark:border-bone-100/5 text-sm">
                <span>{g.name}</span>
                <span className="text-ink-900/40 dark:text-bone-100/40 text-xs">Ouvrir</span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
