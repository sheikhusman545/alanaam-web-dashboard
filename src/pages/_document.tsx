// Import polyfill first to ensure document exists before styled-jsx initializes
import "../../polyfills.js";
import { Html, Head, Main, NextScript } from "next/document";
import { DocumentProps } from "next/document";

const Document: React.FC<DocumentProps> = () => {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/assets/img/brand/apple-icon.png"
        />
        <link rel="icon" href="/assets/img/brand/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

