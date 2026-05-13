import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

const QUESTIONS = [
  { id: "prenom", label: "Quel est ton prenom ?", helper: "Pour personnaliser ma reponse si on s'appelle.", type: "text" },
  { id: "email", label: "Ton email pour qu'on s'appelle 15 min.", helper: "Aucun spam, aucune newsletter automatique.", type: "email" },
  { id: "micro_entrepreneur", label: "Es-tu micro-entrepreneur ou gerant de TPE en France ?", helper: "RelanceIA est concu specifiquement pour ce profil.", type: "single", options: ["Oui", "Non"] },
  { id: "factures_retard", label: "Combien de factures as-tu en retard de plus de 30 jours ?", helper: "Factures emises, non payees, echeance depassee de 30 jours.", type: "single", options: ["Aucune", "1 a 3", "4 a 10", "Plus de 10"] },
  { id: "pret_a_payer", label: "Serais-tu pret a payer 9-19 EUR par mois pour cet outil ?", helper: "Une agence de recouvrement facture 5 a 12 % du montant recouvre.", type: "single", options: ["Oui", "Peut-etre", "Non"] },
];

export default function FormPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  function update(value) { setAnswers((a) => ({ ...a, [current.id]: value })); }

  function canContinue() {
    const v = answers[current.id];
    if (v === undefined || v === "") return false;
    if (current.type === "email") return /.+@.+\..+/.test(v);
    return true;
  }

  async function submit() {
    setStatus("sending"); setErrorMsg("");
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.error || "Erreur reseau"); }
      setStatus("done");
    } catch (e) { setStatus("error"); setErrorMsg(e.message); }
  }

  if (status === "done") {
    return (
      <Shell>
        <Card>
          <p className="text-xs uppercase tracking-wider text-ink-900/60 dark:text-bone-100/60 mb-3">Merci</p>
          <h1 className="serif text-3xl md:text-4xl text-ink-900 dark:text-bone-50 mb-5 leading-tight">Reponse enregistree. Je reviens vers toi sous 48 heures.</h1>
          <p className="text-ink-900/75 dark:text-bone-100/75 leading-relaxed mb-3">Si tu fais partie des 10 premiers repondants qualifies, tu auras acces aux 6 premiers mois du produit gratuitement, en echange de ton feedback honnete.</p>
          <p className="text-ink-900/75 dark:text-bone-100/75 leading-relaxed mb-8">Je veux comprendre comment tu travailles, pas te vendre quoi que ce soit.</p>
          <Link href="/" className="text-sage-600 dark:text-sage-300 hover:underline underline-offset-4">Retour a l'accueil</Link>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell>
      <Head><title>RelanceIA - Sondage</title></Head>
      <Card>
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-ink-900/55 dark:text-bone-100/55 mb-2 uppercase tracking-wider">
            <span>Question {step + 1} sur {QUESTIONS.length}</span>
            <span>{progress} %</span>
          </div>
          <div className="h-1 bg-ink-900/10 dark:bg-bone-100/10 rounded-full overflow-hidden">
            <div className="h-full bg-sage-400 transition-all" style={{ width: progress + "%" }} />
          </div>
        </div>

        <label className="serif block text-2xl md:text-3xl text-ink-900 dark:text-bone-50 mb-2 leading-snug">{current.label}</label>
        {current.helper && <p className="text-sm text-ink-900/55 dark:text-bone-100/55 mb-6 leading-relaxed">{current.helper}</p>}

        {current.type === "single" && (
          <div className="space-y-2">
            {current.options.map((opt) => (
              <button key={opt} type="button" onClick={() => update(opt)} className={"block w-full text-left px-5 py-4 rounded-xl border text-base transition " + (answers[current.id] === opt ? "border-sage-400 bg-sage-400/10 text-ink-900 dark:text-bone-50" : "border-ink-900/10 dark:border-bone-100/10 hover:border-sage-400/60 bg-white/40 dark:bg-white/[0.02]")}>{opt}</button>
            ))}
          </div>
        )}

        {(current.type === "text" || current.type === "email") && (
          <input type={current.type} value={answers[current.id] || ""} onChange={(e) => update(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ink-900/10 dark:border-bone-100/10 bg-white/40 dark:bg-white/[0.02] focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/30 text-base" placeholder={current.type === "email" ? "prenom@exemple.com" : "Prenom"} autoFocus />
        )}

        {status === "error" && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-700 dark:text-red-300">{errorMsg}</div>}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-ink-900/5 dark:border-bone-100/5">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-ink-900/60 dark:text-bone-100/60 disabled:opacity-30 hover:text-ink-900 dark:hover:text-bone-50 text-sm">Precedent</button>
          {!isLast ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canContinue()} className="h-12 px-6 rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 text-sm font-medium disabled:opacity-30 transition">Continuer</button>
          ) : (
            <button type="button" onClick={submit} disabled={status === "sending" || !canContinue()} className="h-12 px-6 rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 text-sm font-medium disabled:opacity-30 transition shadow-glow">{status === "sending" ? "Envoi..." : "Je veux tester RelanceIA"}</button>
          )}
        </div>
      </Card>
      <p className="text-center text-xs text-ink-900/50 dark:text-bone-100/50 mt-6">Tes donnees restent privees. Conformite RGPD, hebergement europeen.</p>
    </Shell>
  );
}

function Card({ children }) {
  return <div className="bg-white/70 dark:bg-white/[0.03] border border-ink-900/5 dark:border-bone-100/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm shadow-soft">{children}</div>;
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-grad-light dark:bg-grad-dark text-ink-900 dark:text-bone-100">
      <header className="border-b border-ink-900/5 dark:border-bone-100/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="py-10 md:py-16 px-4"><div className="max-w-2xl mx-auto">{children}</div></main>
    </div>
  );
}
