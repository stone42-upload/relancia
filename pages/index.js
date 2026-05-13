import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

export default function Home() {
  return (
    <>
      <Head>
        <title>RelanceIA - Les impayes ? Termines.</title>
      </Head>
      <div className="min-h-screen bg-grad-light dark:bg-grad-dark text-ink-900 dark:text-bone-100 transition-colors">
        <Header />
        <Hero />
        <Probleme />
        <Resultats />
        <Trust />
        <CTA />
        <Footer />
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-[15px] text-ink-900/80 dark:text-bone-100/80">
          <a href="#fonctionnalites" className="hover:text-ink-900 dark:hover:text-bone-100">Fonctionnalites</a>
          <a href="#tarifs" className="hover:text-ink-900 dark:hover:text-bone-100">Tarifs</a>
          <a href="#a-propos" className="hover:text-ink-900 dark:hover:text-bone-100">A propos</a>
          <a href="#contact" className="hover:text-ink-900 dark:hover:text-bone-100">Contact</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-8 -left-2 select-none pointer-events-none serif text-[7rem] leading-none text-sage-400/40 dark:text-sage-300/30">&ldquo;</div>
            <h1 className="serif text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.95] tracking-tightest text-ink-900 dark:text-bone-50">
              Les impayés ?<br/>
              <span className="italic">Terminés.</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl leading-relaxed text-ink-900/75 dark:text-bone-100/75 max-w-md">
              L&apos;IA analyse vos factures et relance vos clients en retard pour vous. Simple, efficace et 100% dédié aux micro-entrepreneurs.
            </p>
            <div className="mt-10">
              <Link href="/form" className="inline-flex items-center h-14 px-8 rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 font-medium text-base transition shadow-glow">
                Commencer gratuitement
              </Link>
            </div>
          </div>

          <div className="relative">
            <PaintedChart />
          </div>
        </div>
      </div>
    </section>
  );
}

function PaintedChart() {
  return (
    <div className="relative aspect-[4/3] w-full max-w-[640px] mx-auto">
      <svg viewBox="0 0 640 480" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="paint" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#85A07D" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#A4BB9C" stopOpacity="0.95"/>
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.6 0 0 0 0 0.5 0 0 0 0.04 0"/></filter>
        </defs>
        <path d="M40 400 C 90 380, 130 360, 180 320 S 250 270, 290 290 S 380 220, 430 180 S 540 80, 600 50" fill="none" stroke="#85A07D" strokeOpacity="0.25" strokeWidth="14" filter="url(#soft)" strokeLinecap="round"/>
        <path d="M40 400 C 90 380, 130 360, 180 320 S 250 270, 290 290 S 380 220, 430 180 S 540 80, 600 50" fill="none" stroke="url(#paint)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M580 70 L 605 45 L 600 80 M 605 45 L 570 50" fill="none" stroke="#A4BB9C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <g fontFamily="Cormorant Garamond, Georgia, serif" fontSize="14" fill="currentColor" opacity="0.55" textAnchor="middle">
          <text x="60" y="450">Jun</text>
          <text x="160" y="450">Tu</text>
          <text x="250" y="450">Wd</text>
          <text x="340" y="450">Th</text>
          <text x="430" y="450">Fri</text>
          <text x="520" y="450">Sat</text>
          <text x="600" y="450">Big</text>
        </g>
        <rect width="640" height="480" fill="url(#grain)" opacity="0.5"/>
      </svg>
    </div>
  );
}

function Probleme() {
  return (
    <section id="fonctionnalites" className="border-t border-ink-900/5 dark:border-bone-100/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="serif text-4xl sm:text-5xl text-ink-900 dark:text-bone-50 mb-6">Le problème</h2>
        <p className="text-lg sm:text-xl max-w-3xl leading-relaxed text-ink-900/80 dark:text-bone-100/80">
          Chaque année, des milliers de micro-entrepreneurs perdent du temps et de l&apos;argent à cause des factures impayées. La relance est chronophage et souvent infructueuse.
        </p>
      </div>
    </section>
  );
}

function Resultats() {
  const items = [
    { n: "1", v: "27%", t: "de factures en retard, en moyenne, pour les entrepreneurs." },
    { n: "2", v: "4h30", t: "de temps perdu par mois en moyenne pour les récupérer." },
    { n: "3", v: "14%", t: "d'augmentation de votre chiffre d'affaires en moyenne." },
  ];
  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <h2 className="serif text-4xl sm:text-5xl text-ink-900 dark:text-bone-50 mb-10">Nos résultats</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.n} className="relative rounded-2xl p-7 bg-white/60 dark:bg-white/[0.03] border border-ink-900/5 dark:border-bone-100/10 backdrop-blur-sm">
              <span className="absolute top-5 left-5 w-8 h-8 rounded-full bg-sage-400/15 border border-sage-400/40 text-sage-700 dark:text-sage-300 text-sm font-medium inline-flex items-center justify-center">{it.n}</span>
              <div className="serif text-[64px] leading-none text-ink-900 dark:text-bone-50 mt-12">{it.v}</div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-900/70 dark:text-bone-100/70">{it.t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="border-t border-ink-900/5 dark:border-bone-100/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 text-center">
        <p className="text-sm text-ink-900/60 dark:text-bone-100/60">le relanceur qui a <span className="text-ink-900 dark:text-bone-50 font-medium">confiance</span></p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70 dark:opacity-80">
          <BrandLogo label="stripe" />
          <BrandLogo label="lenway" />
          <BrandLogo label="payplug" />
          <BrandLogo label="bnext" />
        </div>
      </div>
    </section>
  );
}

function BrandLogo({ label }) {
  return <span className="font-semibold text-lg tracking-tight text-ink-900/70 dark:text-bone-100/70">{label}</span>;
}

function CTA() {
  return (
    <section id="tarifs" className="border-t border-ink-900/5 dark:border-bone-100/5">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="serif text-4xl sm:text-5xl text-ink-900 dark:text-bone-50 leading-tight">Rejoindre les 10 premiers beta-testeurs</h2>
        <p className="mt-6 text-lg text-ink-900/75 dark:text-bone-100/75 max-w-xl mx-auto leading-relaxed">Réponds à 5 questions rapides. Si tu fais partie des 10 premiers qualifiés, tu obtiens 6 mois d&apos;accès gratuit au produit fini, en échange de ton feedback.</p>
        <div className="mt-10">
          <Link href="/form" className="inline-flex items-center h-14 px-8 rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 font-medium text-base transition shadow-glow">
            Participer à la phase 0
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink-900/55 dark:text-bone-100/55">Sondage 2 min - Sans carte bancaire</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="a-propos" className="border-t border-ink-900/5 dark:border-bone-100/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Logo />
        <p className="text-xs text-ink-900/55 dark:text-bone-100/55 max-w-md">RelanceIA - outil d&apos;aide aux relances commerciales. Ne remplace pas un conseil juridique. Vos données restent confidentielles.</p>
      </div>
    </footer>
  );
}
