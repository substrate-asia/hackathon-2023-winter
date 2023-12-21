"use client";
import Head from "next/head";
import Heeader from "./HeadTop";
import FrontMain from "./FrontMain";
import DIdentity from "./DIdentity";
import UseCases from "../../components/comps/UseCases";
import Team from "../../components/comps/Team";
import Contact from "../comps/Contact";

export default function Landing() {
  return (
    <>
      <Head>
        <title>Zerk</title>
        <meta
          name="description"
          content="Zerk Network is a crowfunding descentralized platform, that allows community to come toguether and fund legal actions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="..../public/favicon.svg" />
      </Head>
      <header>
        <Heeader />
      </header>
      <main>
        <FrontMain />
      </main>
      <section>
        <UseCases />
      </section>
      <section>
        <DIdentity />
      </section>
      <section>
        <Team />
      </section>
      <footer>
        <Contact />
      </footer>
    </>
  );
}
