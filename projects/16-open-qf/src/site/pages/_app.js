import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";

import "nprogress/nprogress.css";
import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on(
  "routeChangeStart",
  (url, { shallow }) => !shallow && NProgress.start(),
);
Router.events.on(
  "routeChangeComplete",
  (url, { shallow }) => !shallow && NProgress.done(),
);
Router.events.on(
  "routeChangeError",
  (url, { shallow }) => !shallow && NProgress.done(),
);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>OpenSquare Network Quadratic Funding</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
