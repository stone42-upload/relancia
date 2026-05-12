import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

const QUESTIONS = [
  { id: "prenom", label: "Quel est ton prenom ?", helper: "Pour personnaliser ma reponse si on s'appelle.", type: "text", optional: false },
  { id: "email", label: "Ton email pour qu'on s'appelle 15 min.", helper: "Aucun spam, aucune newsletter automatique. Juste un echange direct.", type: "email", optional: false },
  { id: "micro_entrepreneur", label: "Es-tu micro-entrepreneur ou gerant de TPE en France ?", helper: "RelanceIA est concu specifiquement pour ce profil.", type: "single", options: ["Oui", "Non"] },
  { id: "factures_retard", label: "Combien de factures as-tu en retard de plus de 30 jours, a ce moment precis ?", helper: "Factures emises, non payees, dont la date d'echeance est depassee d'au moins 30 jours.", type: "single", options: ["Aucune", "1 a 3", "4 a 10", "Plus de 10"] },
  { id: "pret_a_payer", label: "Serais-tu pret a payer entre 9 et 19 EUR par mois pour cet outil ?", helper: "A titre de comparaison, une agence de recouvrement facture 5 a 12 % du montant recouvre.", type: "single", options: ["Oui", "Peut-etre", "Non"] },
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
    if (current.optional) return true;
    const v = answers[current.id];
    if (v === undefined || v === "") return false;
    if (current.type === "email") return /.+@.+\..+/.test(v);
    return true;
  }

  async function submit() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const payload = { ...answers };
      // Normaliser les valeurs vers ce que l'API accepte
      if (payload.factures_retard) payload.factures_retard = payload.factures_retard.replace(/ a /g, " a ");
      if (payload.pret_a_payer === "Peut-etre") payload.pret_a_payer = "Peut-etre";
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur reseau");
      }
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message);
    }
  }

  if (status === "done") {
    return (
      <Shell>
        <Card>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Merci</p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 leading-tight">Reponse enregistree. Je reviens vers toi sous 48 heures.</h1>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">Si tu fais partie des 10 premiers repondants qualifies, tu auras acces aux 6 premiers mois du produit gratuitement, en echange de ton feedback honnete.</p>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">Je veux comprendre comment tu travailles, pas te vendre quoi que ce soit.</p>
          <Link href="/" className="text-emerald-500 hover:text-emerald-600 underline underline-offset-4">Retour a l'accueil</Link>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell>
      <Head><title>RelanceIA - Sondage de 2 minutes</title></Head>
      <Card>
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2 uppercase tracking-wider">
            <span>Question {step + 1} sur {QUESTIONS.length}</span>
            <span>{progress} %</span>
          </div>
          <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <label className="block text-xl md:text-2xl font-semibold mb-2 leading-snug">
          {current.label}
          {current.optional && <span className="block text-xs text-zinc-400 font-normal mt-1 uppercase tracking-wider">Facultatif</span>}
        </label>
        {current.helper && <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">{current.helper}</p>}

        {current.type === "single" && (
          <div className="space-y-2">
            {current.options.map((opt) => (
              <button key={opt} type="button" onClick={() => update(opt)} className={`block w-full text-left px-5 py-4 rounded-xl border text-base transition ${answers[current.id] === opt ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-[#1E2937]"}`}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.type === "text" && (
          <input type="text" value={answers[current.id] || ""} onChange={(e) => update(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1E2937] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-base" placeholder="Prenom" autoFocus />
        )}

        {current.type === "email" && (
          <input type="email" value={answers[current.id] || ""} onChange={(e) => update(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1E2937] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-base" placeholder="prenom@exemple.com" autoFocus />
        )}

        {status === "error" && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">{errorMsg}</div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-zinc-500 disabled:opacity-30 hover:text-zinc-900 dark:hover:text-white text-sm">Precedent</button>
          {!isLast ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canContinue()} className="h-11 px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium disabled:opacity-30 transition">Continuer</button>
          ) : (
            <button type="button" onClick={submit} disabled={status === "sending" || !canContinue()} className="h-11 px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium disabled:opacity-30 transition">
              {status === "sending" ? "Envoi..." : "Je veux tester RelanceIA"}
            </button>
          )}
        </div>
      </Card>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">Tes donnees restent privees. Conformite RGPD, hebergement europeen.</p>
    </Shell>
  );
}

function Card({ children }) {
  return <div className="bg-white dark:bg-[#1E2937] border border-zinc-200 dark:border-zinc-700/70 rounded-2xl p-6 md:p-10 shadow-glowSoft">{children}</div>;
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-zinc-900 dark:text-white">
      <header className="border-b border-zinc-200 dark:border-zinc-800/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="py-10 md:py-16 px-4"><div className="max-w-2xl mx-auto">{children}</div></main>
    </div>
  );
}
