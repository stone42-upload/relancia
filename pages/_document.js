import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap" />
        <meta name="description" content="RelanceIA - L'IA qui analyse vos factures et relance vos clients en retard pour vous." />
        <meta property="og:title" content="RelanceIA - Les impayes ? Termines." />
        <meta property="og:description" content="L'IA analyse vos factures et relance vos clients en retard pour vous. Simple, efficace et 100% dedie aux micro-entrepreneurs." />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
