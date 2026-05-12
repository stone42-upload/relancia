import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

export default function Home() {
  return (
    <>
      <Head>
        <title>RelanceIA - Les impayes ? Termines.</title>
        <meta name="description" content="L'IA analyse vos factures, predit les risques de retard et envoie des relances naturelles a votre place." />
      </Head>
      <div className="min-h-screen bg-white dark:bg-[#0F172A] text-zinc-900 dark:text-white">
        <Header />
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <FormCTA />
        <Footer />
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800/70 sticky top-0 z-30 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <a href="#fonctionnalites" className="hover:text-zinc-900 dark:hover:text-white">Fonctionnalites</a>
          <a href="#tarifs" className="hover:text-zinc-900 dark:hover:text-white">Tarifs</a>
          <a href="#a-propos" className="hover:text-zinc-900 dark:hover:text-white">A propos</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/form" className="hidden sm:inline-flex h-9 px-4 items-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition">Commencer</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <h1 className="text-[44px] sm:text-[56px] md:text-[64px] leading-[1.02] font-semibold tracking-tightest">
              Les impayes ?<br /><span className="text-emerald-500">Termines.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              L'IA analyse vos factures, predit les risques de retard et envoie des relances naturelles a votre place. Simple, efficace, dedie aux micro-entrepreneurs francais.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/form" className="inline-flex h-12 px-6 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-base font-medium transition shadow-glowSoft">Commencer gratuitement</Link>
              <a href="#how" className="inline-flex h-12 px-6 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-base font-medium transition">Comment ca marche</a>
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Essai 14 jours - Sans carte bancaire - 10 places gratuites pour la phase 0</p>
          </div>
          <div className="relative"><ChartCard /></div>
        </div>
      </div>
    </section>
  );
}

function ChartCard() {
  return (
    <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#1E2937] p-5 sm:p-7 shadow-glowSoft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Tresorerie recuperee</p>
          <p className="text-2xl font-semibold mt-1">+ 4 200 EUR / an</p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">en moyenne</span>
      </div>
      <svg viewBox="0 0 400 180" className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <path d="M0,150 C60,140 90,130 130,115 C180,95 210,90 250,70 C300,50 330,35 400,15" fill="none" stroke="#10b981" strokeOpacity="0.35" strokeWidth="6" filter="url(#glow)"/>
        <path d="M0,150 L0,180 L400,180 L400,15 C330,35 300,50 250,70 C210,90 180,95 130,115 C90,130 60,140 0,150 Z" fill="url(#fillGrad)"/>
        <path d="M0,150 C60,140 90,130 130,115 C180,95 210,90 250,70 C300,50 330,35 400,15" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="400" cy="15" r="5" fill="#10b981"/>
        <circle cx="400" cy="15" r="9" fill="#10b981" opacity="0.25"/>
      </svg>
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <KPI label="Delai moyen" value="4h30" />
        <KPI label="Taux reponse" value="14%" />
        <KPI label="Economies" value="-5h/mois" />
      </div>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#0F172A]/50 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </div>
  );
}

function Stats() {
  const items = [
    { value: "27%", label: "des factures sont payees en retard de plus de 30 jours" },
    { value: "4h30", label: "par mois perdues en moyenne a relancer vos clients" },
    { value: "14%", label: "taux de reponse moyen sur les relances classiques" },
  ];
  return (
    <section id="fonctionnalites" className="border-y border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#1E2937]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Le probleme en chiffres</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl leading-tight">Ce qui coute vraiment cher quand tu travailles seul</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#1E2937] p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center">{i + 1}</span>
              </div>
              <div className="text-4xl md:text-5xl font-semibold text-emerald-500 tabular-nums tracking-tight">{it.value}</div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Le probleme</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-5">Tu ne peux pas relancer correctement 50 clients a la main, chaque mois.</h2>
      <div className="space-y-4 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
        <p>Chaque annee, des milliers de micro-entrepreneurs perdent du temps et de l'argent a cause des factures impayees. La relance manuelle est chronophage, stressante, et souvent inefficace : un email generique a J+30 obtient en moyenne 1,8 % de taux de reponse.</p>
        <p>Quand tu factures 30 000 EUR par an, ca represente 4 200 EUR qui dorment chez tes clients pendant que toi, tu travailles deja sur le mois suivant. Les agences de recouvrement facturent 5 a 12 % du montant recouvre. Toi, tu n'as ni le temps, ni les outils.</p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Tu uploades tes factures", body: "PDF ou CSV, en un glisser-deposer. L'IA extrait automatiquement le client, le montant, la date d'echeance et l'historique. Zero saisie manuelle." },
    { n: "02", title: "L'IA predit qui va payer en retard", body: "Un score de risque de 1 a 10 calcule sur le comportement historique de chaque client. Tu vois en un coup d'oeil les factures qui risquent de devenir des impayes." },
    { n: "03", title: "Trois relances redigees pour toi", body: "Courtoise, ferme, tres ferme. Texte naturel signe de ton nom, adapte au profil du client. Pas de templates generiques qui sonnent faux." },
    { n: "04", title: "Envoi automatique au bon moment", body: "Tu valides en un clic, l'IA envoie. Tu recois une notification quand le client repond. Tu reprends le controle de ta tresorerie en moins de 5 min par semaine." },
  ];
  return (
    <section id="how" className="border-t border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#1E2937]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Comment ca marche</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl leading-tight">Quatre etapes. Cinq minutes par semaine.</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-[#1E2937] p-6 md:p-8">
              <div className="text-sm font-mono text-emerald-500 tracking-wider">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold leading-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormCTA() {
  return (
    <section id="tarifs" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Phase 0 - Validation</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-4">Rejoindre les 10 premiers beta-testeurs</h2>
      <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl mx-auto mb-8">Reponds a 5 questions rapides. Si tu fais partie des 10 premiers qualifies, tu recois 6 mois d'acces gratuit au produit fini, en echange de ton feedback.</p>
      <Link href="/form" className="inline-flex h-12 px-7 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-base font-medium transition shadow-glowSoft">Participer a la phase 0</Link>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Sondage de 2 minutes - Pas de carte bancaire</p>
    </section>
  );
}

function Footer() {
  return (
    <footer id="a-propos" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Logo />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">RelanceIA - outil d'aide aux relances commerciales. Ne remplace pas un conseil juridique ou un recouvrement contentieux. Vos donnees restent confidentielles.</p>
      </div>
    </footer>
  );
}
