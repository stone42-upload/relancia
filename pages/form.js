import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const QUESTIONS = [
  {
    id: "factures_retard",
    label: "Combien de factures as-tu actuellement en retard de plus de 30 jours ?",
    type: "single",
    options: ["0", "1-3", "4-10", "10+"],
  },
  {
    id: "temps_relances",
    label: "Combien de temps passes-tu par mois sur les relances et le suivi des paiements ?",
    type: "single",
    options: ["Moins de 2h", "2-5h", "5-10h", "Plus de 10h"],
  },
  {
    id: "pret_a_payer",
    label: "Si un outil t'envoyait des relances personnalisées qui marchent, tu paierais 9-19 €/mois ?",
    type: "single",
    options: ["Oui", "Peut-être", "Non"],
  },
  {
    id: "methode_actuelle",
    label: "Comment tu relances actuellement tes clients ? (2-3 phrases)",
    type: "textarea",
    optional: true,
  },
  {
    id: "email",
    label: "Ton email (pour qu'on se parle, optionnel)",
    type: "email",
    optional: true,
  },
];

export default function FormPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  function update(value) {
    setAnswers((a) => ({ ...a, [current.id]: value }));
  }

  function canContinue() {
    if (current.optional) return true;
    const v = answers[current.id];
    return v !== undefined && v !== "";
  }

  async function submit() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur réseau");
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
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-3">Merci !</h1>
          <p className="text-slate-600 mb-6">
            Je reviens vers toi très vite. Si tu as donné ton email, tu recevras un message pour un appel rapide de 15 min.
          </p>
          <Link href="/" className="text-brand-600 hover:underline">← Retour</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Head>
        <title>RelanceIA — Sondage 2 min</title>
      </Head>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Question {step + 1} / {QUESTIONS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <label className="block text-xl font-semibold mb-6">
          {current.label}
          {current.optional && <span className="block text-xs text-slate-400 font-normal mt-1">Optionnel</span>}
        </label>

        {current.type === "single" && (
          <div className="space-y-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update(opt)}
                className={`block w-full text-left px-5 py-4 rounded-xl border-2 transition ${
                  answers[current.id] === opt
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.type === "textarea" && (
          <textarea
            value={answers[current.id] || ""}
            onChange={(e) => update(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-600 focus:outline-none"
            placeholder="Ex: Je rappelle par téléphone, puis je relance par email à J+15..."
          />
        )}

        {current.type === "email" && (
          <input
            type="email"
            value={answers[current.id] || ""}
            onChange={(e) => update(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-600 focus:outline-none"
            placeholder="toi@exemple.com"
          />
        )}

        {status === "error" && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-slate-500 disabled:opacity-40 hover:text-slate-700"
          >
            ← Retour
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue()}
              className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-brand-700"
            >
              Continuer →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={status === "sending"}
              className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-brand-700"
            >
              {status === "sending" ? "Envoi..." : "Envoyer"}
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-block text-sm text-slate-500 hover:text-slate-700 mb-6">
          ← RelanceIA
        </Link>
        {children}
      </div>
    </main>
  );
}
