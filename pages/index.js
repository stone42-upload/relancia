import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>RelanceIA — L'IA qui s'occupe de tes relances</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="font-bold text-xl">💰 RelanceIA</div>
          <Link href="/form" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
            Participer au test
          </Link>
        </nav>

        <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🚀 Phase 0 — On valide avec 10 micro-entrepreneurs
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Fini les impayés.
            <br />
            <span className="text-brand-600">L'IA s'occupe de tout.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Tu uploads tes factures. L'IA prédit qui va payer en retard, génère des relances naturelles et les envoie pour toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/form" className="bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-600/30">
              Donner mon avis (2 min) →
            </Link>
            <a href="#how" className="bg-white text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition border border-slate-200">
              Comment ça marche
            </a>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat number="30%" label="des factures payées en retard > 30j" />
            <Stat number="5h" label="par mois perdues à relancer" />
            <Stat number="2%" label="taux de réponse des relances génériques" />
          </div>
        </section>

        <section id="how" className="max-w-4xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Step n="1" title="Upload" body="Tu glisses tes factures PDF dans l'app." />
            <Step n="2" title="Analyse" body="L'IA extrait les données et score le risque d'impayé client par client." />
            <Step n="3" title="Relance" body="Elle envoie des emails personnalisés au bon moment, dans le bon ton." />
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
            <h3 className="text-2xl font-bold mb-3">Aide-moi à le construire</h3>
            <p className="text-slate-600 mb-6">
              Je cherche 10 micro-entrepreneurs pour valider le concept. 2-3 min de ton temps, accès gratuit en avant-première.
            </p>
            <Link href="/form" className="inline-block bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-700">
              Répondre au sondage →
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          RelanceIA — outil d'aide aux relances, ne remplace pas un conseil juridique.
        </footer>
      </main>
    </>
  );
}

function Stat({ number, label }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
      <div className="text-4xl font-extrabold text-brand-600 mb-2">{number}</div>
      <div className="text-slate-600 text-sm">{label}</div>
    </div>
  );
}

function Step({ n, title, body }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">{n}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{body}</p>
    </div>
  );
}
