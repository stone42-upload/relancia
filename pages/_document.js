import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta name="description" content="RelanceIA - l'IA qui s'occupe de tes relances de factures." />
        <meta property="og:title" content="RelanceIA - Les impayes ? Termines." />
        <meta property="og:description" content="L'IA analyse vos factures, predit les risques de retard et envoie des relances naturelles." />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
