import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/img/favicon.png" />
        <meta property="og:title" content="OrbisDB Studio | Your Decentralized Database" key="og_title" />
        <meta property="og:description" content="OrbisDB is an advanced decentralized database built on the Ceramic Data Network. It comes with a set of plugins allowing unlimited customization options." key="og_description"/>
        <meta property="og:image" content="https://studio.useorbis.com/img/og-image.png" />
        <meta property="twitter:card" content="https://studio.useorbis.com/img/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}