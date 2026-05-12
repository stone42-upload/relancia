import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta name="description" content="RelanceIA — l'IA qui s'occupe de tes relances de factures pour que tu touches ton argent." />
        <meta property="og:title" content="RelanceIA — Fini les impayés" />
        <meta property="og:description" content="L'IA analyse tes factures, prédit qui va payer en retard, et envoie les relances pour toi." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%92%B0%3C/text%3E%3C/svg%3E" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
