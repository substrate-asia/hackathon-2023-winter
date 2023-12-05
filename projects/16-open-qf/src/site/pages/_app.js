import Head from "next/head";
import { Inter, Montserrat } from "next/font/google";
import NProgress from "nprogress";
import Router from "next/router";
import store from "@/store";
import theme from "@/styles/light";
import { Provider } from "react-redux";

import "nprogress/nprogress.css";
import "semantic-ui-css/semantic.min.css";
import "styles/globals.css";
import { cn } from "utils";
import { ThemeProvider } from "styled-components";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>OpenSquare Network Quadratic Funding</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <main
            className={cn(inter.className, inter.variable, montserrat.variable)}
          >
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
